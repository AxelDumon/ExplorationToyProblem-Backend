import { Collection, Document, Filter } from "mongodb";
import { Agent } from "../Agent.js";
import { Cell } from "../Cell.js";
import { BaseRepository } from "./interfaces/BaseRepository.js";

export abstract class BasicMongoRepository<T extends (Cell | Agent) & Document>
  implements BaseRepository<T>
{
  public collectionGetter: () => Collection<T>;

  constructor(collectionGetter: () => Collection<T>) {
    this.collectionGetter = collectionGetter;
  }

  async deleteAll(): Promise<void> {
    await this.collectionGetter().deleteMany({});
  }

  async count(): Promise<number> {
    return await this.collectionGetter().countDocuments();
  }

  async findAll(): Promise<T[]> {
    return (await this.collectionGetter().find().toArray()) as T[];
  }

  async create(item: T): Promise<T> {
    const result = await this.collectionGetter().insertOne(item as any);
    return { ...item, _id: result.insertedId.toString() } as T;
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    const result = await this.collectionGetter().findOneAndUpdate(
      { _id: id } as Filter<T>,
      { $set: item },
      { returnDocument: "after", upsert: true }
    );
    if (!result || !("value" in result)) return null;
    return result.value as T | null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.collectionGetter().deleteOne({ _id: id } as any);
    return result.deletedCount === 1;
  }
}
