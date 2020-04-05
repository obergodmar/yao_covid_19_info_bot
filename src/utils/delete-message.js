export const deleteMessage = (id, Covid19InfoBot, waitMessage) => (
    waitMessage
        .then(({message_id}) =>
            Covid19InfoBot
                .deleteMessage(id, message_id)
        ).catch(error => console.log(`The error occurred: ${error}`))
);
