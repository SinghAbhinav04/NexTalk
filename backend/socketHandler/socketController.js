const UserStatus = require('../models/userStatusModel');

function setupSocketHandlers(io, socket) {
    socket.on('mark-seen', async (messageId) => {
        try {
            await Message.findByIdAndUpdate(messageId, {
                status: 'seen',
                seenAt: new Date()
            });
        } catch (error) {
            console.error('Error marking message as seen:', error);
        }
    });

    socket.on('disconnect', async () => {
        try {
            await UserStatus.findOneAndUpdate(
                { socketId: socket.id },
                { status: 'offline', socketId: '' }
            );
        } catch (error) {
            console.error('Disconnect error:', error);
        }
    });
}

module.exports = setupSocketHandlers;