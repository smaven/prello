import dayjsBase from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const dayjs = dayjsBase;
dayjs.extend(relativeTime);

export { dayjs };
