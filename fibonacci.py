"""Utilities for working with Fibonacci numbers."""


def fibonacci(n: int) -> int:
    """Return the nth Fibonacci number using zero-based indexing.

    The sequence is defined as F(0) = 0 and F(1) = 1.

    Args:
        n: A non-negative integer index.

    Raises:
        TypeError: If n is not an integer.
        ValueError: If n is negative.
    """
    if isinstance(n, bool) or not isinstance(n, int):
        raise TypeError("n must be a non-negative integer")
    if n < 0:
        raise ValueError("n must be a non-negative integer")

    previous, current = 0, 1
    for _ in range(n):
        previous, current = current, previous + current
    return previous
