export function encodeAndProcessParameter(params, sequence = null) {
  const getValue = (key) => (params[key] !== undefined ? params[key] : '');

  // If no sequence is provided, use the keys of the params object
  const finalSequence = sequence || Object.keys(params);

  // Create the param_list by following the final sequence and joining with "^^"
  return finalSequence.map(getValue).join('^^');
}
