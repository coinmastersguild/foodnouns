import classes from './Unminted.module.css';
import Section from '../../layout/Section';
import { ImageData } from '@nouns/assets';
import { useQuery } from '@apollo/client';
import { mintedHeads } from '../../wrappers/foodnoun-subgraph';
import { Table } from 'react-bootstrap';
import { useHeadCount } from '../../wrappers/nounsDescriptor';

const Unminted = () => {
  const { loading, error, data } = useQuery(mintedHeads());

  const headCount = useHeadCount() ?? 0;

  if (loading) {
    return (
      <div>
        <b>loading...</b>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <b>error...</b>
      </div>
    );
  }

  return (
    <Section fullWidth={false} className={classes.wrapper}>
      <div style={{ textAlign: 'center' }}>
        <h2>Unminted Heads</h2>
        <h2>Total Heads: {headCount}</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table borderless style={{ alignSelf: 'center', width: 800 }}>
          <tr>
            <th>#</th>
            <th style={{ textAlign: 'center' }}>Head Name</th>
            <th style={{ textAlign: 'center' }}>Minted</th>
          </tr>

          {ImageData.images.heads.map((item: any, index: number) => {
            let minted = 'NO';

            const find = data.seeds.findIndex((x: any) => parseInt(x.head) === index);

            if (find > -1) minted = 'YES';

            return (
              <tr>
                <td>{index + 1}</td>
                <td style={{ textAlign: 'center' }}>{item.filename}</td>
                <td style={{ textAlign: 'center' }}>{minted}</td>
              </tr>
            );
          })}
        </Table>
      </div>
    </Section>
  );
};
export default Unminted;
