// generate a roomID - string

export const generateRoomId = () => {
    const chars ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const length = 10;

    // loop which will run 10 times and create a string code from this -

    const stringLength = chars.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * stringLength);

        result += chars[randomIndex];  //pick a character based on the random index from the chars
    }

    return result;
    }

