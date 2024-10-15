'use server';

import {connector} from '@/commons/database';
import BookEntity from '@/entities/book.entity';
import {MongoError} from 'mongodb';
import fs from 'fs';
import path from 'path';
import RentEntity from '@/entities/rent.entity';

// Utility function for slug generation
const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

export const bookSeed = async () => {
  await connector();

  const books = [
    new BookEntity({
      title: 'The Founding Father',
      image: '/uploads/the-founding-father.jpeg',
      slug: generateSlug('The Founding Father'),
      author: 'Ahmad Rusdy',
      description: 'Asia, perempuan yang merantau ke Palapa untuk merintis karir sebagai musisi, secara tidak sengaja menyaksikan pembunuhan di Taman Literasi sehabis menyelesaikan pertunjukannya di RockStars Cafe, Palapa Barat.\n' +
        '\n' +
        'Jangan sampai ada saksi, Asia membatin, meniru apa yang didengar dari salah satu dari tiga lelaki di taman. Dia bergidik saat mengingat hanya dia seorang yang menjadi saksi pembunuhan tersebut. ',
      category: 0,
      pages: 1057,
      publisher: 'Ahmad Rusdy',
      publishedAt: new Date('2024-02-25'),
      language: 'Indonesia',
      deleted: false
    }),
    new BookEntity({
      title: 'Milea: Suara dari Dilan',
      image: '/uploads/milea.jpeg',
      slug: generateSlug('Milea: Suara dari Dilan'),
      author: 'Pidi Baiq',
      description: '\n' +
        '"Dilan memberi penggambaran lain dari sebuah penaklukan cinta & bagaimana indahnya cinta sederhana anak zaman dahulu." @refaniris\n' +
        '"Cuma satu yang kuinginkan, aku ingin cowok seperti Dilan." @_SLovaFC\n' +
        '\n' +
        '"Dilan brengsek! Dia selalu tahu caranya menjadi pusat perhatian, bahkan ketika jadi buku, setiap serinya selalu ditunggu." @Tedy_Pensil\n' +
        '\n' +
        '"Membaca Dilan itu seperti jatuh cinta lagi, lagi, dan lagi. Ah, indah, deh. Rasanya gak akan pernah bosan membacanya." @agungwyd\n' +
        '\n' +
        '"Bukan cuma sekadar novel, tapi bisa menjadikan yang malas baca jadi mau baca." @cobra_iqq\n' +
        '\n' +
        '"Kisah cintanya gak lebay. Dilan tahu bagaimana memperlakukan wanita. Novelnya keren, bahasanya gak bertele-tele." @AH_DILAN\n' +
        '\n' +
        '"Terima kasih Dilan telah menginspirasiku lewat ceritamu bersama Milea. Terima kasih Surayah, novelmu seru." @EnciSrifiyani\n' +
        '\n' +
        '"Dari Dilan kita belajar mengistimewakan wanita, romantis yang gak kuno, bahkan menjadi ayah & bunda yang hebat :)" @ginaalna\n' +
        '\n' +
        '"Kurasa Dilan satu-satunya novel yang aku harap ceritanya terus berlanjut, dan tidak ingin ada akhir." @TriaFitriaN41\n' +
        '\n' +
        '[Mizan, Pastel Books, Dilan, Milea, Romance, Remaja, Bandung, 1990, 1991, Novel, Best Seller, Indonesia]',
      category: 1,
      pages: 360,
      publisher: 'Pastel Books',
      publishedAt: new Date('2016-02-17'),
      language: 'Indonesia',
      deleted: false
    }),
    new BookEntity({
      title: 'Pengenalan Prinsip Data Science untuk Pemula',
      image: '/uploads/pengenalan-prinsip.jpeg',
      slug: generateSlug('Pengenalan Prinsip Data Science untuk Pemula'),
      author: 'Bernardus Ari Kuncoro, S.T., M.T.I.',
      description: 'Harvard Business Review sangat berjasa dalam memopulerkan profesi Data Scientist. Dalam artikel yang mereka rilis pada Oktober 2012, mereka menekankan bahwa Data Scientist merupakan pekerjaan paling seksi di abad 21. Di mana pun, tidak terkecuali Indonesia, bertebaran lowongan pekerja profesional data dengan iming-iming gaji besar.\n' +
        'Seiring dengan membludaknya minat anak-anak muda berprofesi sebagai data scientist, tentunya persaingan semakin ketat dan menuntut setiap dari kandidat untuk memiliki kualitas dan karakter yang unik.\n' +
        '\n' +
        'E-book ini merupakan buku seri pertama dari enam seri yang dirilis. Diramu dari berbagai pemahaman dasar dan pengalaman penulis selama lebih dari 6 tahun berprofesi sebagai Data Scientist. Terbit di tengah keringnya buku-buku data science berbahasa Indonesia yang dekat dengan penerapannya di bidang industri. Temukan kekuatan dasar dan inspirasi untuk menjadi profesional data yang kreatif dan ulung!',
      category: 2,
      pages: 26,
      publisher: 'Mripat Publisher',
      publishedAt: new Date('2020-12-25'),
      language: 'Indonesia',
      deleted: false
    }),
    new BookEntity({
      title: 'Untold Story Jack MA, Pendiri Alibaba.com: No.1 Richest Billionaires In China',
      image: '/uploads/jack-ma.jpeg',
      slug: generateSlug('Untold Story Jack MA, Pendiri Alibaba.com: No.1 Richest Billionaires In China'),
      author: 'Sigit Parikesit',
      description: 'Jack Ma adalah salah satu sosok sukses yang telah membuktikan bahwa konsistensi, kerja keras, dan ketekunan dalam belajar bisa membawanya mendirikan perusahaan bisnis berbasis online terbesar di Tiongkok Alibaba grup.\n' +
        '\n' +
        'Buku ini hadir untuk menginspirasi kita semua akan bisnis ecommerce dan filosofi timur dalam berbisnis.Daftar Isi sudah tercover di google play book memudahkan membaca dan mencari cepat.',
      category: 3,
      pages: 141,
      publisher: 'Banana Books',
      publishedAt: new Date('2016-04-11'),
      language: 'Indonesia',
      deleted: false
    }),
  ];

  try {
    for (const book of books) {
      const existingBook = await BookEntity.findOne({ slug: book.slug });
      if (!existingBook) {
        await book.save();
        console.log(`Inserted book: ${book.title}`);
      } else {
        console.log(`Book with slug ${book.slug} already exists. Skipping...`);
      }
    }
    console.log('Books seeded successfully!');
    return 'success';
  } catch (error) {
    console.error('Error seeding books:', error);
    return 'error';
  }
};


// Utility function for uploading images to the "public" directory
const uploadImage = async (imageFile: File): Promise<string> => {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${imageFile.name}`;
  const filePath = path.join(uploadsDir, fileName);

  // Convert the File object to a Buffer
  const arrayBufferPromise = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBufferPromise);

  fs.writeFileSync(filePath, buffer);

  return `/uploads/${fileName}`;
};

// Create a new book
export const createBook = async (payload: FormData) => {
  const rawFormData = Object.fromEntries(payload);

  const buff = {
    title: rawFormData.title,
    author: rawFormData.author,
    description: rawFormData.description,
    category: rawFormData.category,
    pages: rawFormData.pages,
    publisher: rawFormData.publisher,
    publishedAt: rawFormData.publishedAt,
    language: rawFormData.language,
    image: rawFormData.image,
  };


  try {
    await connector();

    // Generate the slug from the title
    const slug = generateSlug(buff.title as string);

    // Check if a book with the same slug already exists
    const exists = await BookEntity.findOne({ slug });
    if (exists) {
      return {
        code: 409,
        status: 'Conflict',
        message: 'Book with this title already exists!',
      };
    }

    // Upload the image
    const imageUrl = await uploadImage(buff.image as File);

    const newBook = new BookEntity({
      title: buff.title,
      slug,
      author: buff.author,
      description: buff.description,
      category: buff.category,
      pages: buff.pages,
      publisher: buff.publisher,
      publishedAt: buff.publishedAt,
      language: buff.language,
      image: imageUrl,
    });

    await newBook.save();

    return {
      code: 201,
      status: 'Created',
      message: 'Book created successfully',
      data: newBook,
    };
  } catch (err) {
    // Handle duplicate key error
    if (err instanceof MongoError && err.code === 11000) {
      return {
        code: 409,
        status: 'Conflict',
        message: 'Book with this title already exists!',
      };
    }

    console.log(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};

// Get a book by its ID
export const getBookById = async (id: string) => {
  try {
    await connector();
    const book = await BookEntity.findById(id);

    if (!book) {
      return {
        code: 404,
        status: 'Not Found',
        message: 'Book not found',
      };
    }

    return {
      code: 200,
      status: 'OK',
      data: {
        _id: book._id.toString(),
        title: book.title.toString(),
        slug: book.slug,
        author: book.author,
        description: book.description,
        category: book.category,
        pages: book.pages,
        publisher: book.publisher,
        publishedAt: book.publishedAt,
        language: book.language,
        image: book.image,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
    };
  } catch (err) {
    console.log(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};

// Update a book by its ID
export const updateBook = async (bookId: string, payload: FormData) => {
  const rawFormData = Object.fromEntries(payload);

  const buff = {
    title: rawFormData.title,
    author: rawFormData.author,
    description: rawFormData.description,
    category: rawFormData.category,
    pages: rawFormData.pages,
    publisher: rawFormData.publisher,
    publishedAt: rawFormData.publishedAt,
    language: rawFormData.language,
    image: rawFormData.image, // Image is optional
  };

  try {
    await connector();

    // Generate the slug from the title
    const slug = generateSlug(buff.title as string);

    // Check if a book with the same slug already exists, excluding the current book
    const exists = await BookEntity.findOne({ slug, _id: { $ne: bookId } });
    if (exists) {
      return {
        code: 409,
        status: 'Conflict',
        message: 'Book with this title already exists!',
      };
    }

    // eslint-disable-next-line
    const updateData: any = {
      title: buff.title,
      slug,
      author: buff.author,
      description: buff.description,
      category: buff.category,
      pages: buff.pages,
      publisher: buff.publisher,
      publishedAt: buff.publishedAt,
      language: buff.language,
    };

    // If an image is provided, upload it and add it to the update data
    if (buff.image) {
      updateData.image = await uploadImage(buff.image as File);
    }

    const updatedBook = await BookEntity.findByIdAndUpdate(bookId, updateData, { new: true });

    if (!updatedBook) {
      return {
        code: 404,
        status: 'Not Found',
        message: 'Book not found.',
      };
    }

    return {
      code: 200,
      status: 'OK',
      message: 'Book updated successfully',
      data: updatedBook,
    };
  } catch (err) {
    // Handle duplicate key error
    if (err instanceof MongoError && err.code === 11000) {
      return {
        code: 409,
        status: 'Conflict',
        message: 'Book with this title already exists!',
      };
    }

    console.log(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};


export const deleteBook = async (bookId: string) => {
  try {
    // Check if the book is currently rented
    const rent = await RentEntity.findOne({ bookId });
    if (rent) {
      return {
        code: 400,
        status: 'Bad Request',
        message: 'Cannot delete book while it is currently rented.',
      };
    }

    // Soft delete the book
    await BookEntity.findByIdAndUpdate(bookId, { deleted: true });

    return {
      code: 200,
      status: 'OK',
      message: 'Book soft deleted successfully.',
    };
  } catch (err) {
    console.error(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};

export const listBooks = async (page: number = 1, limit: number = 10, search: string = '', category: string = '') => {
  try {
    await connector();

    const skip = (page - 1) * limit;

    // eslint-disable-next-line
    const filter: any = { deleted: false };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    const [books, total] = await Promise.all([
      BookEntity.find(filter).skip(skip).limit(limit),
      BookEntity.countDocuments(filter),
    ]);

    return {
      code: 200,
      status: 'OK',
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    console.log(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};

export const allBooks = async (search: string = '', category: string = '') => {
  try {
    await connector();

    // eslint-disable-next-line
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    const books = await BookEntity.find(filter);

    return {
      code: 200,
      status: 'OK',
      data: books,
    };
  } catch (err) {
    console.log(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};

export const findBookBySlug = async (slug: string) => {
  try {
    await connector();

    const book = await BookEntity.findOne({ slug });

    if (!book) {
      return {
        code: 404,
        status: 'Not Found',
        message: 'Book not found',
      };
    }

    return {
      code: 200,
      status: 'OK',
      data: book,
    };
  } catch (err) {
    console.log(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};


export const getTotalBooks = async () => {
  try {
    await connector();
    return {
      code: 200,
      status: 'OK',
      data: await BookEntity.countDocuments({ deleted: false }),
    };
  } catch (err) {
    console.log(`Error: ${err}`);
    return {
      code: 500,
      status: 'Internal Server Error',
      message: 'Something went wrong',
    };
  }
};
