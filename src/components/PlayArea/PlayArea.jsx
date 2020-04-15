import React from 'react';
import './PlayArea.scss';
import Card from '../Card';

const PlayArea = ({ question }) => {
  return (
    <>
      {question &&
        <div id='playarea'>
          <Card content={question} type='question' />
          {/* <Card content='Jugar carta' type='interactive' /> */}
        </div>
      }
    </>
  )
}

export default PlayArea;