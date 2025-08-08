import { RoadmapItem } from './list';

export const Roadmap = ({ list }: { list: RoadmapItem[] }) => {
  const orderList = ['inProgress', 'notStarted', 'completed'];
  return (
    <div className="roadmap">
      {list
        .sort(
          (a, b) => orderList.indexOf(a.status) - orderList.indexOf(b.status),
        )
        .map(Item)}
    </div>
  );
};

const Item = ({
  title,
  status = 'notStarted',
}: {
  title: string;
  status: 'notStarted' | 'inProgress' | 'inReview' | 'completed';
}) => {
  return (
    <div className={['roadmap-item', status].join(' ')}>
      <div className="left">
        <div className="dot" />
        <div className="title">{title}</div>
      </div>
      <span className="pill">
        {status === 'notStarted' && 'Not Started'}
        {status === 'inProgress' && 'In Progress'}
        {status === 'inReview' && 'Ready for Review'}
        {status === 'completed' && 'Completed'}
      </span>
    </div>
  );
};
