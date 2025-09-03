import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { baseUrl, publisherID } from '../../../constants';
import ButtonLoader from '../../../common/button_loader';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const LinkArtist = () => {
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');

  const [inputError, setInputError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error
    setInputError('');

    // Frontend validations
    if (facebook === '') {
      setInputError('Facebook required.');
      return;
    }

    if (twitter === '') {
      setInputError('Twitter required.');
      return;
    }

    if (instagram === '') {
      setInputError('Insgatram required.');
      return;
    }

    if (youtube === '') {
      setInputError('Youtube required.');
      return;
    }

    // Prepare minimal payload for backend link-artist step
    const formData = new FormData();
    formData.append('publisher_id', publisherID);

    const url = '/api/accounts/complete-link-artist/';

    try {
      setLoading(true);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          setInputError(errorMessages.join('\n'));
        } else {
          setInputError(data.message || 'Failed to update social.');
        }
        return;
      }

      // ✅ Successful submission
      console.log('Social updated successfully');

      // Move to next onboarding step (backend returns this)
      const nextStep = data.data.next_step;

      switch (nextStep) {
        case 'profile':
          navigate('/onboarding/profile');
          break;
        case 'revenue-split':
          navigate('/onboarding/revenue-split');
          break;
        case 'payment':
          navigate('/onboarding/payment');
          break;
        case 'link-artist':
          navigate('/onboarding/link-artist');
          break;
        case 'done':
          navigate('/dashboard');
          window.location.reload();
          break;
        default:
          navigate('/dashboard'); // fallback
          window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setInputError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] flex items-center justify-center">
      <div className="w-full max-w-2xl px-6">
        <h2 className="text-5xl font-bold text-white text-center mb-8">
          ZamIO
        </h2>

        {inputError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {inputError}</span>
          </div>
        )}

        <div className="bg-white/10 p-10 rounded-2xl backdrop-blur-md w-full border border-white/20 shadow-xl">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            🎧 Sign/Link Artists
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className=" text-white text-center mb-8">
                Invite artists by email
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="">
                  <input
                    type="text"
                    name="report"
                    placeholder="Invite Artist"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="w-full px-6 py-4 mb-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <textarea
                    name="report"
                    placeholder="Artist to invite here"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="w-full px-6 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Submit Button */}
                {loading ? (
                  <ButtonLoader />
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-4 rounded-lg mt-6 "
                  >
                    Update split
                  </button>
                )}
              </form>
            </div>

            <div>
              <p className=" text-white text-center mb-8">
                Accept or deny artist association requests
              </p>

        
            </div>
          </div>
          {/* Link to Register */}
          <p className=" text-white mt-6 text-center">
            <Link
              to="/onboarding/payment"
              className="underline text-white hover:text-blue-200"
            >
              Skip
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkArtist;
