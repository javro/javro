import React from 'react';

type Props = {
  avro: {
    value: string;
  };
  json: {
    value: string;
  };
  changeJson: (value: string) => void;
  changeAvro: (value: string) => void;
};

export default function Editor(props: Props) {
  const { avro, json, changeJson, changeAvro } = props;

  return (
    <div>
      <h1>JSON</h1>
      <input
        type="text"
        value={json.value}
        onChange={({ target }) => changeJson(target.value)}
      />

      <h1>AVRO</h1>
      <input
        type="text"
        value={avro.value}
        onChange={({ target }) => changeAvro(target.value)}
      />
    </div>
  );
}
