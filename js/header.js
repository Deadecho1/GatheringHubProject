document.addEventListener('userDataReady', () => {
        setAvatarData(userData);
});

function setAvatarData(data) {
    try {
        setElementImage('avatar-bg', `images/avatar_bgs/${data.avatarBg}.png`, data.avatarBg);
        setElementImage('avatar-img', `images/avatars/${data.avatar}.png`, data.avatar);
        setElementText('avatar-name', data.name);
        setElementText('avatar-lvl', data.lvl);
    } catch (error) {
        console.error('Error setting avatar data:', error);
    }
}