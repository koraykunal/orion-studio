export function seeded(index: number) {
    const x = Math.sin(index * 735.17) * 10000;
    return x - Math.floor(x);
}
