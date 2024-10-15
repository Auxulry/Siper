export declare namespace UserDeclaration {
    interface UserDocument {
        _id: string;
        name: string;
        email: string;
        password: string;
        phone: string;
        isAdmin: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    type RegisterPayload = {
      name: string;
      email: string;
      password: string;
      phone: string;
    }
}
