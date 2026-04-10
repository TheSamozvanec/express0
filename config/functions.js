export function parseExpiresIn(expiresIn) {
    // Если уже число в секундах
    if (typeof expiresIn === 'number') {
        return expiresIn * 1000;
    }
    
    // Парсим строку вида "120m", "2h", "1d"
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
        throw new Error(`Invalid expiresIn format: ${expiresIn}`);
    }
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch(unit) {
        case 's': return value * 1000;           // секунды
        case 'm': return value * 60 * 1000;      // минуты
        case 'h': return value * 60 * 60 * 1000; // часы
        case 'd': return value * 24 * 60 * 60 * 1000; // дни
        default: return value * 1000;
    }
}