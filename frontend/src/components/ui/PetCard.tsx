
import { Cat, Dog, MoreHorizontal } from 'lucide-react';

export type Pet = {
  id: number;
  name: string;
  species: 'Cachorro' | 'Gato';
  breed: string;
  age: string;
  photoUrl?: string;
};

type PetCardProps = {
  pet: Pet;
  onOpen: (pet: Pet) => void;
};

export default function PetCard({ pet, onOpen }: PetCardProps) {
  const PetIcon = pet.species === 'Gato' ? Cat : Dog;

  return (
    <article className="pet-card">
      <div className="pet-card-top">
        {pet.photoUrl ? (
          <img
            className="pet-avatar"
            src={pet.photoUrl}
            alt={pet.name}
          />
        ) : (
          <div className="pet-avatar pet-avatar-placeholder">
            <PetIcon size={30} />
          </div>
        )}

        <button
          className="icon-button pet-more-button"
          onClick={() => onOpen(pet)}
          aria-label={`Ver detalhes de ${pet.name}`}
        >
          <MoreHorizontal size={22} />
        </button>
      </div>

      <h3>{pet.name}</h3>
      <p className="pet-breed">{pet.species} · {pet.breed}</p>
      <p className="pet-age">{pet.age}</p>

      <button
        className="pet-details-button"
        onClick={() => onOpen(pet)}
      >
        Ver detalhes
      </button>
    </article>
  );
}
