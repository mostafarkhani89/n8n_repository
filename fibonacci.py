"""Utilities for working with Fibonacci sequences."""


def fibonacci(n: int) -> list[int]:
    """Return the first ``n`` Fibonacci numbers.

    The sequence starts with 0 and 1.

    Args:
        n: The number of sequence members to return.

    Returns:
        A list containing ``n`` Fibonacci numbers.

    Raises:
        TypeError: If ``n`` is not an integer.
        ValueError: If ``n`` is negative.
    """
    if isinstance(n, bool) or not isinstance(n, int):
        raise TypeError("n must be a non-negative integer")
    if n < 0:
        raise ValueError("n must be a non-negative integer")

    sequence: list[int] = []
    previous, current = 0, 1
    for _ in range(n):
        sequence.append(previous)
        previous, current = current, previous + current
    return sequence


if __name__ == "__main__":
    print(fibonacci(10))
