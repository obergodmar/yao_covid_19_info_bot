export const logCommand = ({
    first_name,
    username
}, {
    input
}) => console.log(`${first_name} (${username}): TEXT - ${input}`);
