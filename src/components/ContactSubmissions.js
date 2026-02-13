import React, { useState, useEffect } from 'react';
import { contactService } from '../services/api';
import './ContactSubmissions.css';

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContacts();
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load contact submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await contactService.updateContactStatus(id, newStatus);
      fetchSubmissions();
    } catch (err) {
      setError('Failed to update status');
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await contactService.deleteContact(id);
        fetchSubmissions();
      } catch (err) {
        setError('Failed to delete submission');
        console.error('Error deleting submission:', err);
      }
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Loading submissions...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="contact-submissions">
      <h2>Contact Form Submissions</h2>
      
      <div className="submissions-list">
        {submissions.length === 0 ? (
          <div className="no-submissions">No submissions found</div>
        ) : (
          submissions.map((submission) => (
            <div key={submission._id} className="submission-card">
              <div className="submission-header">
                <h3>{submission.subject}</h3>
                <span className={`status ${submission.status}`}>
                  {submission.status}
                </span>
              </div>
              
              <div className="submission-info">
                <p><strong>From:</strong> {submission.name} ({submission.email})</p>
                <p><strong>Date:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
                <p className="message-preview">{submission.message.substring(0, 100)}...</p>
              </div>

              <div className="submission-actions">
                <button 
                  className="view-button"
                  onClick={() => handleViewDetails(submission)}
                >
                  View Details
                </button>
                
                <div className="status-actions">
                  {submission.status === 'pending' && (
                    <button
                      className="mark-read-button"
                      onClick={() => handleStatusUpdate(submission._id, 'read')}
                    >
                      Mark as Read
                    </button>
                  )}
                  {submission.status === 'read' && (
                    <button
                      className="mark-replied-button"
                      onClick={() => handleStatusUpdate(submission._id, 'replied')}
                    >
                      Mark as Replied
                    </button>
                  )}
                </div>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(submission._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && selectedSubmission && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedSubmission.subject}</h3>
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p><strong>From:</strong> {selectedSubmission.name}</p>
              <p><strong>Email:</strong> {selectedSubmission.email}</p>
              <p><strong>Date:</strong> {new Date(selectedSubmission.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> <span className={`status ${selectedSubmission.status}`}>{selectedSubmission.status}</span></p>
              <div className="message-content">
                <h4>Message:</h4>
                <p>{selectedSubmission.message}</p>
              </div>
            </div>

            <div className="modal-footer">
              <div className="status-actions">
                {selectedSubmission.status === 'pending' && (
                  <button
                    className="mark-read-button"
                    onClick={() => {
                      handleStatusUpdate(selectedSubmission._id, 'read');
                      setShowModal(false);
                    }}
                  >
                    Mark as Read
                  </button>
                )}
                {selectedSubmission.status === 'read' && (
                  <button
                    className="mark-replied-button"
                    onClick={() => {
                      handleStatusUpdate(selectedSubmission._id, 'replied');
                      setShowModal(false);
                    }}
                  >
                    Mark as Replied
                  </button>
                )}
              </div>
              <button
                className="delete-button"
                onClick={() => {
                  handleDelete(selectedSubmission._id);
                  setShowModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions; 