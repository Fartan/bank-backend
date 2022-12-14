import { Pessoa } from "@/domain/pessoa/pessoa.entity";
import { PessoaRepository } from "@/domain/pessoa/pessoa.repository";
import crypto from "crypto";

let nextId = 1;

export class PessoaInMemoryRepository implements PessoaRepository {
  private static instance: PessoaInMemoryRepository;

  static get() {
    return (this.instance ??= new this());
  }

  primaryIndex = new Map<number, Pessoa>();

  cpfIndex = new Map<string, Pessoa>();

  async create(pessoa: Pessoa): Promise<Pessoa> {
    pessoa.id = nextId++;
    pessoa.created_at = new Date();
    pessoa.updated_at = new Date();

    this.primaryIndex.set(pessoa.id, pessoa);
    this.cpfIndex.set(pessoa.cpf, pessoa);

    return pessoa;
  }

  async findOrCreate(pessoa: Pessoa): Promise<Pessoa> {
    return (await this.findByCPF(pessoa.cpf)) ?? (await this.create(pessoa));
  }

  async findByCPF(cpf: string): Promise<Pessoa | null> {
    return this.cpfIndex.get(cpf) ?? null;
  }

  async findByAuth(cpf: string, senha: string): Promise<Pessoa | null> {
    const pessoa = await this.findByCPF(cpf);

    if (pessoa && pessoa.senha === senha) {
      return pessoa;
    }

    return null;
  }

  async findById(id: number): Promise<Pessoa | null> {
    return this.primaryIndex.get(id) ?? null;
  }
}
