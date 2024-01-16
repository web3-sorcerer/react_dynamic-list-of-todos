import { useEffect, useState, FC } from 'react';
import { Loader } from '../Loader';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { getUser } from '../../api';

interface Props {
  selected: Todo,
  onClose: () => void,
}

export const TodoModal: FC<Props> = ({
  selected,
  onClose,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setLoading(true);

    getUser(selected.userId)
      .then(setSelectedUser)
      .catch(() => setErrorMessage('Cannot find a user'))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="modal is-active" data-cy="modal">
      <div className="modal-background" />

      {loading ? (
        <Loader />
      ) : (
        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              {`Todo #${selected.id}`}
            </div>

            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={onClose}
            />
          </header>

          {errorMessage ? (
            <div className="modal-card-body">
              <p className="block" data-cy="modal-title">
                {errorMessage}
              </p>
            </div>
          ) : (
            <div className="modal-card-body">
              <p className="block" data-cy="modal-title">
                {selected.title}
              </p>
              <p className="block" data-cy="modal-user">
                {/* <strong className="has-text-success">Done</strong> */}

                {selected.completed
                  ? (<strong className="has-text-success">Done</strong>)
                  : (<strong className="has-text-danger">Planned</strong>)}

                {' by '}

                <a href={`mailto:${selectedUser?.email}`}>
                  {selectedUser?.name}
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};