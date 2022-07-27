export class Entity {
  id!: number;
  created_at!: Date;
  updated_at!: Date;

  toJSON() {
    return {
      id: this.id,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
    };
  }
}
