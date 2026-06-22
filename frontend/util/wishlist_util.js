// 愿望单使用 localStorage，key 为 wishlist_{userId}
const wishlistKey = (userId) => `wishlist_${userId}`;

export const getWishlist = (userId) => {
    const saved = localStorage.getItem(wishlistKey(userId));
    return saved ? JSON.parse(saved) : {};
};

export const saveWishlist = (userId, wishlist) => {
    localStorage.setItem(wishlistKey(userId), JSON.stringify(wishlist));
};

export const addToWishlist = (userId, game) => {
    const wishlist = getWishlist(userId);
    wishlist[game.id] = game;
    saveWishlist(userId, wishlist);
    return wishlist;
};

export const removeFromWishlist = (userId, gameId) => {
    const wishlist = getWishlist(userId);
    delete wishlist[gameId];
    saveWishlist(userId, wishlist);
    return wishlist;
};

export const isInWishlist = (userId, gameId) => {
    const wishlist = getWishlist(userId);
    return Boolean(wishlist[gameId]);
};
