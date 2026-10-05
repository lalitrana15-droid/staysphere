import { Property } from "@/types";
import { PROP_IMGS } from "./elivaas-images";

type R = [string, number, number, number, number, string];

const CDN = (f: string) => `https://cpjlcwamma.cloudimg.io/${f}?width=800&height=600&func=boundmin&force_format=webp&q=85`;

const IMGS: Record<string, string[]> = {
  raj: [
    "Mountain_Creek_ea937f9099.png","P1036106_ba6bdbfba9.jpg","K81_A1371_9a2b60a38a.jpg",
    "3_S7_A5812_HDR_96b1963bd9.webp","K81_A8825_9eb1babbce.jpg","8_G9_A7123_74ae9fd025.jpg",
    "K81_A7292_1_e8e064e22b.jpg","P1036450_88760ea110.jpg","K81_A1159_37b37c0f6c.jpg",
    "P1036484_409fa6c0dd.jpg","IMG_1112_HDR_1a26d387e1.webp","K81_A9532_d102bdeb0e.webp",
    "Shourya_Villa_jpg_d99001ae79.jpeg","K81_A7139_14b40fadae.jpg","8_G9_A2151_d2ee80dd06.jpg",
    "K81_A6703_ea7825d8f7.jpg","IMG_0150_9e3b0b58ab.webp","P1045630_6ade6f2bc1.jpg",
    "IMG_6908_HDR_379a54e766.webp","K81_A7587_4af1b820a3.jpg","P1045699_8a558983fc.jpg",
    "K81_A1813_HDR_4f4bf46e01.webp","K81_A1803_HDR_3094209ffb.webp",
    "dji_fly_20250605_192812_425_1749562752042_photo_5d7d8d2d31.jpg",
    "wmremove_transformed_1_bf582eb88d.png","8_G9_A9087_1ff35ef81f.jpg",
    "P1020559_4da47c72b8.jpg","IMG_7600_b6da8d99d8.webp","DSC_4012_copy_2_5914382752.jpg",
    "DJI_20260303185516_0188_D_a204a43ba3.jpg","P1037041_b54ddfc49c.jpg",
    "K81_A1828_HDR_84cca4eb0f.webp","K81_A4759_fc57dc1894.jpg","P1046243_539ad22420.jpg",
    "K81_A7471_61fd052454.jpg","Lagoon_Hero_e238d4d293.png","K81_A9919_a39d87f4c9.jpg",
    "K81_A6616_1_c411c8dfed.jpg","8_G9_A2970_f688794f14.jpg","P1045234_ef5fbad1b1.jpg",
    "Lush_Haven_Drone_ceff512a3a.png","8_G9_A3976_ff5807a2f5.jpg","K81_A9870_ca38168c08.jpg",
    "SHU_00265_HDR_83b4431cb8.jpg","K81_A6223_af99f7efa5.jpg","New_Project_5_324799235e.webp",
    "8_G9_A1430_6b7520b5dd.jpg","8_G9_A0680_1_e05fcbb3b5.jpg","pic_1_328421dcb2.webp",
    "K81_A8679_32d294873b.jpg","FC_3_a59cba3fdb.jpg","K81_A5843_204af98612.jpg",
    "2_V7_A8311_65e4548f4f.jpg","8_G9_A3066_2c1a6d3f4b.jpg","8_G9_A8375_4476219b70.jpg",
    "ARP_00050_HDR_9906d3fbc0.webp","pic_3_02d0a00ae5.webp","IMG_8064_HDR_c2a4a58d1c.webp",
    "AVI_8662_a153fc339e.jpg","villa_skylark_jpg_1c61d3a4f4.jpeg","Laurels_e5e61e6cb5.png",
    "Cabana_5062f56f14.png","DJI_20260825132015_0980_8def22a39e.jpg",
    "New_Project_1_a9de43cfa9.webp","hf_20260620_222156_77d21032_18de_4a5c_9fff_02155a47e407_3728e46ec1.jpg",
    "DJI_20260617174819_0044_D_b1e38d028d.jpg","P1024719_b381ce80b3.jpg","K81_A9193_8d5a371684.jpg",
  ].filter(f => !/^(Chat_GPT_Image_|Untitled_design_)/.test(f)).map(CDN),
  hill: [
    "Hero_Image_jpg_ba7644fa35.jpeg","1_H7_A2404_1_9a8c37cd80.jpg","K81_A9451_7a917df548.jpg",
    "DJI_20250417165411_0307_D_Edit_1_7e7a5f66cd.jpg","1_c74fe27020.jpg",
    "DJI_20250612183038_0729_D_86b6dbbb30.JPG","Kosh_Villa_0a9d4e9188.png",
    "DJI_0134_7bce1a0c64.JPG","Chat_GPT_Image_Jul_9_2026_11_28_02_AM_8f69647139.png",
    "Beyond_the_Curb_7df835516d.png","IMG_8477_JPG_7ccfb0a26c.jpeg",
    "Chat_GPT_Image_Jul_8_2026_06_06_16_PM_b9ab8bed84.png","IMG_1_7_19dcdd0e96.jpg",
    "Chat_GPT_Image_May_6_2026_01_02_49_PM_2b7653358f.png",
    "DJI_20260728125926_0816_D_upscale_standard_face_recovery_v3_172e9b85e1.jpg",
    "drone_2d8a2e7e6d.JPG","Chat_GPT_Image_Feb_26_2026_01_53_36_PM_6bfc0983fa.png",
    "DJI_20260728130325_0820_D_upscale_standard_face_recovery_v3_0dc10b076c.jpg",
    "IMG_1_11_9c99daf0d0.jpg","DJI_20251114135740_0044_D_aaabad0874.JPG",
    "DJI_0158_cf21805c31.JPG","1_H7_A4559_1b64fde7be.webp","1_H7_A5810_e3b9fa59ff.webp",
    "DJI_20260314182955_0522_D_d569ce992a.jpg","2_V7_A8019_8adbdecd7a.webp",
    "IMG_5985_c2325ec934.webp","DSC_2300_1_2_3_4_f9eed3c940.jpg","Pine_view_cottage_55db14b8d4.png",
    "K81_A7483_HDR_47cae04854.webp","K81_A7463_HDR_224621730a.webp","DSC_08343_234c5b0096.webp",
    "K81_A7452_0c0f735e66.webp","8_G9_A1492_0c22d2f217.webp","P1038636_f58f518ebb.jpg",
    "K81_A7473_HDR_94b638d25a.webp","K81_A7542_78756e49fc.webp","K81_A7488_HDR_8d6907b136.webp",
    "P1038633_79ffe080d9.jpg","IMG_9928_HDR_a0cb45af0f.webp","2_V7_A8187_5f1c6f4f2c.jpeg",
    "8_G9_A0044_aa31bbf559.jpg","IMG_9923_HDR_b845906a39.webp",
    "Skylounge_4_45e24fe0f2.png","IMG_2240_HDR_1ec859df92.webp","IMG_2095_HDR_1_ff944516ca.webp",
    "IMG_6580_1_3b70ea0238.webp","DSC_02108_9b72e31516.jpg","DJI_20240918041107_0503_D_28bdca995d.JPG",
    "2_V7_A6296_HDR_bcf1fde247.webp","DSC_01530_98d8b6ce2e.jpg","012_dd06af2405.jpg",
    "DSC_02010_1_a03c448449.jpg","DSC_02093_1_6eea8472d5.jpg","Baljees_1_bac91a3a8f.png",
    "09_d42192a28c.jpg",
    "IMG_5801_7f1e5fcc92.webp","Chat_GPT_Image_May_5_2026_06_51_27_PM_1370ed8450.png",
    "K81_A9729_HDR_2_5bfd168daf.webp","8_G9_A1439_757292ae2a.jpg","DJI_0948_11029828d5.webp",
    "facade_c6e805f9e6.jpg","Chat_GPT_Image_May_5_2026_05_10_06_PM_f6d461e316.png",
    "Amara_Hero_6b949e7d46.png","8_G9_A1407_c02965c949.jpg","8_G9_A1446_41d06db732.jpg",
    "8_G9_A0078_9483011b60.jpg",
    "8_G9_A0170_35f1dcd10a.jpg","8_G9_A0161_7e58395030.jpg","2_V7_A9939_9bc8bf9628.jpg",
    "8_G9_A0188_7a9720aa87.jpg","8_G9_A8565_fc64ea55f0.jpg","8_G9_A8626_b55ef4688c.jpg",
    "8_G9_A9212_6946a272ee.jpg","2_V7_A1060_d9ffb6c0f3.jpg","Fram_cfd44f4fe6.png",
    "DH_4_A2059_54223402ec.jpg","DJI_20250425181908_0188_D_1_7967cdfb14.jpg",
    "8_G9_A9564_3ee6fed62e.jpg","8_G9_A2445_aa2c7141ce.jpg",
    "Chat_GPT_Image_May_5_2026_06_23_44_PM_926c2a6ab5.png",
    "Chat_GPT_Image_Jul_8_2026_05_09_05_PM_709436ea47.png","8_G9_A9653_f10353e047.jpg",
    "K81_A8435_1e371e8bb2.jpg","1_1458d286a6.jpg","Cozy_Nest_c7884e9e10.png",
    "3_S7_A4925_HDR_8514e45435.webp","3_S7_A4771_HDR_8e2a9b3600.webp","3_S7_A4779_HDR_7c2eef6f26.webp",
    "2_V7_A8877_0fd1c1f996.jpg","8_G9_A8671_1f5d93c33d.jpg","DJI_0506_fd78e71519.JPG",
    "Trio_s_6c753dd788.jpg","8_G9_A8362_9b314e71e5.jpg",
    "8_G9_A5713_4a94954b62.jpg","DJI_20251212132912_0120_D_Edit_copy_ff16ad6a14.jpg",
    "Chat_GPT_Image_May_5_2026_06_38_36_PM_0e0c98f1a1.png",
  ].filter(f => !/^(Chat_GPT_Image_|Untitled_design_)/.test(f)).map(CDN),
  goa: [
    "DSC_00280_d5a7b9ed51.webp","Untitled_design_4952fb431e.jpg","DSC_02980_HDR_e0d2d2d364.webp",
    "1_5_68_27_1_94_17_18_18_18_6e69f03d47.webp","DSC_04387_598b2b543b.webp",
    "4_R0_A0095_HDR_9e9b6b4b66.jpg","3_S7_A3385_HDR_e6b50f3bf1.jpg","1_57f9a1733a.jpg",
    "DSC_06437_6bb56ffe9d.webp","PASSAGE_3_d72d795cac.png","OMI_04423_HDR_761604cb8a.jpg",
    "Maison_Hero_114016f5d6.png","DSC_07963_0a8a67ba7d.jpg",
    "Chat_GPT_Image_Aug_20_2026_05_10_46_PM_c4a5f50b59.png","DSC_09321_527bbd30c8.jpg",
    "PS_16_822f555325.webp","Casa_Eden_Hero_1806450548.png","DSC_00160_d2ddb42d9f.webp",
    "DSC_06487_HDR_77f63d5600.webp","Fernweh_ef70b52dca.png","DSC_00662_cddcac5750.jpg",
    "DSC_03732_Pano_fcaaf4d767.webp","1_1_e32c8787e9.jpg","DSC_04170_HDR_2_064f9c6429.webp",
    "DSC_00971_HDR_f6d303ff75.webp","Chat_GPT_Image_Jul_7_2026_11_09_55_AM_02c09c2f89.png",
    "Veera_Marina_90119efaca.png","DSC_04289_2_f60e531a92.webp",
  ].filter(f => !/^(Chat_GPT_Image_|Untitled_design_)/.test(f)).map(CDN),
  mah: [
    "DSC_07556_57_58_59_60_copy_3b558c7a1c.webp","DSC_0472_d8a68e1636.jpg",
    "DSC_9901_06f894cc6c.jpg","New_Project_3538cde2fa.webp","RK_Villa_26af8595a9.png",
    "DSC_8885_HDR_a2a8f849fc.jpg","Chat_GPT_Image_Feb_23_2026_03_08_19_PM_37b1bbd8cf.png",
    "3_S7_A6941_HDR_18a717c774.jpg","Untitled_design_2322df878b.png","New_Project_935db25d03.webp",
    "Untitled_design_2_ef074d9237.png","Untitled_design_1_e24d6b4e30.png",
    "Lavender_Hills_47fa079d36.png","DSC_03416_1be605d70a.jpg","DSC_4049_HDR_7e8e4f8e59.jpg",
    "JPG_4853_HDR_copy_8e0126430b.jpg","New_Project_17251ed00d.webp",
    "Karuna_Kutir_Villa_0e02e33d56.png","RNP_05322_2_76a7a0e9a0.jpg",
    "DJI_20250117130129_0321_D_f96c5441ee.jpg","DSC_9459_HDR_7d45b04d8e.JPG",
    "RNP_05300_2_f0a602116d.jpg","DSC_7107_HDR_201bc08fe6.jpg","RNP_05563_2_91f129fb03.jpg",
    "HEAVENLY_2_jpg_5f2e21c60b.jpeg","Chat_GPT_Image_Jul_9_2026_05_03_09_PM_b3fb7a4a02.png",
    "Chat_GPT_Image_May_7_2026_04_42_04_PM_bc2c52a4cb.png",
    "DJI_20260702183156_0024_D_110ef664a6.jpg","Ansh_Villa_4b11002362.png","P1039647_96f1a3b9e3.jpg",
    "Chat_GPT_Image_Sep_14_2026_01_01_28_PM_b876c1efe0.png",
    "DJI_20260327190504_0478_D_7607b60fac.jpg","DSC_0822_9ce9213dd5.jpg",
    "DSC_1288_HDR_867ca565dd.jpg","DSC_0791_HDR_d92e9b078d.jpg","P1039382_1_831fcafabe.jpg",
    "DJI_0167_HDR_0cde8004dc.jpg",
    "75_d405b462b5.png","120_585023cb99.png","61_bf7cb11720.png","22_a7cdbea59d.png",
  ].filter(f => !/^(Chat_GPT_Image_|Untitled_design_)/.test(f)).map(CDN),
  kerala: [
    "5_X8_A1922_copy_6464bb95c0.JPG","58962_294e377fca.png","1_035b0fe57b.jpg",
    "P1038840_003bdc3df0.jpg","12596_ead1efac4e.png","Tales_By_Tamarind_aeeac9248c.png",
    "P1042089_JPG_jpg_ecf0671648.jpeg","Mangaly_Heritage_ba91efbf03.png","DSC_09818_4d477e8fb6.jpg",
    "DSC_02145_HDR_725fa14c7a.jpg","DJI_20260725212655_0246_D_00f18139ec.jpg",
  ].filter(f => !/^(Chat_GPT_Image_|Untitled_design_)/.test(f)).map(CDN),
  dubai: [
    "55495_10_1b90560c96.jpg","197333_28_0aacab1c55.jpg",
    "Chat_GPT_Image_Jul_14_2026_03_08_58_PM_9fdbfc1c46.png",
    "Chat_GPT_Image_Jul_14_2026_05_50_19_PM_2e25f5fff7.png",
    "Chat_GPT_Image_Jul_30_2026_02_49_11_PM_cb363d8c65.png",
    "Chat_GPT_Image_Jul_16_2026_01_26_51_PM_b889a92869.png",
    "62783_02_8b2a43fa99_5cc1ab6e17.jpg","Chat_GPT_Image_Jun_13_2026_05_09_15_PM_25516585d8.png",
    "Chat_GPT_Image_Jul_31_2026_11_39_06_AM_91968bb74e.png",
    "Chat_GPT_Image_Jul_21_2026_11_22_58_AM_217069b57a.png",
    "Chat_GPT_Image_Jul_21_2026_12_34_39_PM_e7f2af6593.png",
    "197274_326695141_5784c73f60.jpg","197326_410_df3690324a.jpg","54536_01_5992c0558a.jpg",
    "Chat_GPT_Image_Jun_6_2026_03_28_02_PM_be18388fb8.png","201578_1757063195_0e29f53a49.jpg",
    "200196_1756557937_c239081fb8.jpg","Chat_GPT_Image_Jul_6_2026_10_51_50_AM_2a770c8787.png",
    "Chat_GPT_Image_Jul_20_2026_11_18_50_AM_bb5f9e2e48.png",
    "Chat_GPT_Image_Jul_15_2026_11_01_10_AM_7275d9fcd1.png",
    "Chat_GPT_Image_Jun_17_2026_05_30_32_PM_5118492664.png",
    "Chat_GPT_Image_Jul_17_2026_12_05_32_PM_07be6101bc.png","216934_15_6a16a86dae.jpg",
    "s_2_3505820a72.jpg","Chat_GPT_Image_Jul_30_2026_06_39_32_PM_e59cf44bd4.png",
    "Jun_12_2026_05_13_43_PM_57d2a9af8d.png","223902_10_fba14f21e9.jpg",
    "205151_44_669a4fe44b.jpg","Chat_GPT_Image_Jul_30_2026_04_20_24_PM_01806b7d29.png",
    "251212_21601_18767326b8.jpg","Chat_GPT_Image_Aug_22_2026_05_40_16_PM_59e305c1a1.png",
    "Chat_GPT_Image_Jul_29_2026_04_30_01_PM_6f681dc0d5.png","245168_1772626734_d3002c6d56.jpg",
    "Chat_GPT_Image_Jun_20_2026_02_46_20_PM_2f4499567b.png",
  ].filter(f => !/^(Chat_GPT_Image_|Untitled_design_)/.test(f)).map(CDN),
  ncr: [
    "DJI_20250825183910_0135_D_9f661a1695.jpg","Heaven_Farm_2955358d63.png",
    "712_A5833_d42fd6f1c0.jpg","712_A5967_695f13d060.jpg","P1042315_d832153d35.jpg",
    "IMG_9709_bc3022a919.jpg","DJI_20250825184147_0140_D_2e8a2b092f.jpg",
    "ARP_09638_HDR_6499a17211.jpg","2_V7_A0560a_94bb7d0c23.jpg","8_G9_A0588_1f417ef382.jpg",
    "1_648af5fb9f.jpg","DSC_06142_97a85da65e.webp","IMG_7810_67afc74e00.webp",
    "Chat_GPT_Image_Mar_6_2026_11_43_29_AM_a77a95f96a.png",
    "0_A0_A4223_HDR_copy_9e0b797d49.jpg","K81_A7058_HDR_d3bb5122e4.webp",
    "Chat_GPT_Image_Feb_17_2026_11_23_26_AM_4b7f771b31.png","2_V7_A1645_1_d2645de7d6.jpg",
    "8_G9_A0355_f52beba705.jpg","K81_A9675a_HDR_c8bd7233e9.webp","0_A0_A1400_762096c08f.jpg",
    "K81_A6522_HDR_affc57cabb.webp","Chat_GPT_Image_May_6_2026_12_51_01_PM_682aa6c25b.png",
    "2_V7_A0848_f815768e13.jpg","IMG_5572_HDR_1_172da36c86.webp",
    "DSC_8288_89_90_91_92_copy_1_1cd8dd0fef.webp","ASK_farms_b8f881b2b1.png",
    "K81_A6297_HDR_c8e8d96f69.webp",
  ].filter(f => !/^(Chat_GPT_Image_|Untitled_design_)/.test(f)).map(CDN),
  blr: [
    "Villa_1_4by5_Insta_Post_Landscape_6_9b93a58364.jpg","V_Illa_25_C2_L_19_b6e19196e7.jpg",
    "1_fbae0972e5.jpg","P1023646_041023c9f4.jpg","1_f4722795c3.jpg",
    "Villa_25_159_b499dc1053.jpg","Villa_25_95_3f684ccb02.jpg",
    "Chat_GPT_Image_May_5_2026_12_23_31_PM_6c93721c56.png","P1040617_2e0aa71823.jpg",
    "MG_6814_HDR_fbd52121ac.jpg","L2_fb3a601be8.jpg","DSC_05894_HDR_c93707826f.jpg",
    "wmremove_transformed_e3cf53093b.png","JJE_07452_3_4_5_6_copy_c992954974.jpg",
    "JWS_06818_HDR_18d239f707.jpg","1773906784868_fe2ba3a398.jpg","P1041542_f4f5c101e9.jpg",
    "P1037318_96ce73369e.jpg","PANA_0673_2b04809abc.jpg","K81_A0310_719c7999da.jpg",
    "PANA_0254_901653b22d.jpg","PANA_0556_0401dce620.jpg","AKC_09572_HDR_3b2a668969.jpg",
    "PANA_0878_60be82dd2a.jpg","K81_A0269_b9827e104e.jpg",
    "DJI_20260310182930_0255_D_dc165f6c8f.jpg","DJI_20260425175013_0567_D_4ed844f187.jpg",
    "P1040649_33367e5e45.jpg","P1040750_ad694ef898.jpg","P1040750_1_0aebb52ad3.jpg",
  ].filter(f => !/^(Chat_GPT_Image_|Untitled_design_)/.test(f)).map(CDN),
  coast: [
    "DSC_06323_b35da64a86.jpg","DJI_0428_ce9ff38633.jpg","8_4f9caa768e.jpg",
  ].filter(f => !/^(Chat_GPT_Image_|Untitled_design_)/.test(f)).map(CDN),
  south: [
    "DJI_20251128172605_0344_D_6381796530_HDR_037af9ecfa.jpg","IAP_9221_HDR_493c0a0643.jpg",
    "DSC_5376_f9b80b9692.jpg","DSC_5170_2c9d1a6d72.jpg","Cleft_8915c424ff.jpg",
  ].filter(f => !/^(Chat_GPT_Image_|Untitled_design_)/.test(f)).map(CDN),
};

type CConf = { id: string; slug: string; city: string; state?: string; country: string; img: string };
const C: Record<string, CConf> = {
  udr:  { id: "1",  slug: "udaipur",      city: "Udaipur",      state: "Rajasthan",        country: "India", img: "raj"   },
  jpr:  { id: "3",  slug: "jaipur",       city: "Jaipur",       state: "Rajasthan",        country: "India", img: "raj"   },
  ngoa: { id: "2",  slug: "goa",          city: "North Goa",    state: "Goa",              country: "India", img: "goa"   },
  sgoa: { id: "2",  slug: "goa",          city: "South Goa",    state: "Goa",              country: "India", img: "goa"   },
  alb:  { id: "8",  slug: "alibaug",      city: "Alibaug",      state: "Maharashtra",      country: "India", img: "coast" },
  dxb:  { id: "9",  slug: "dubai",        city: "Dubai",                                   country: "UAE",   img: "dubai" },
  ksl:  { id: "5",  slug: "kasauli",      city: "Kasauli",      state: "Himachal Pradesh", country: "India", img: "hill"  },
  msr:  { id: "6",  slug: "mussoorie",    city: "Mussoorie",    state: "Uttarakhand",      country: "India", img: "hill"  },
  lon:  { id: "7",  slug: "lonavala",     city: "Lonavala",     state: "Maharashtra",      country: "India", img: "mah"   },
  bhm:  { id: "11", slug: "bhimtal",      city: "Bhimtal",      state: "Uttarakhand",      country: "India", img: "hill"  },
  ddn:  { id: "12", slug: "dehradun",     city: "Dehradun",     state: "Uttarakhand",      country: "India", img: "hill"  },
  nnl:  { id: "13", slug: "nainital",     city: "Nainital",     state: "Uttarakhand",      country: "India", img: "hill"  },
  shl:  { id: "14", slug: "shimla",       city: "Shimla",       state: "Himachal Pradesh", country: "India", img: "hill"  },
  jcr:  { id: "15", slug: "jim-corbett",  city: "Jim Corbett",  state: "Uttarakhand",      country: "India", img: "hill"  },
  nsk:  { id: "16", slug: "nashik",       city: "Nashik",       state: "Maharashtra",      country: "India", img: "mah"   },
  krj:  { id: "17", slug: "karjat",       city: "Karjat",       state: "Maharashtra",      country: "India", img: "mah"   },
  crg:  { id: "18", slug: "coorg",        city: "Coorg",        state: "Karnataka",        country: "India", img: "blr"   },
  igt:  { id: "19", slug: "igatpuri",     city: "Igatpuri",     state: "Maharashtra",      country: "India", img: "mah"   },
  mkt:  { id: "20", slug: "mukteshwar",   city: "Mukteshwar",   state: "Uttarakhand",      country: "India", img: "hill"  },
  alp:  { id: "21", slug: "alappuzha",    city: "Alappuzha",    state: "Kerala",           country: "India", img: "kerala"},
  chn:  { id: "22", slug: "chennai",      city: "Chennai",      state: "Tamil Nadu",       country: "India", img: "south" },
  kch:  { id: "23", slug: "kochi",        city: "Kochi",        state: "Kerala",           country: "India", img: "kerala"},
  kld:  { id: "24", slug: "kolad",        city: "Kolad",        state: "Maharashtra",      country: "India", img: "mah"   },
  rnt:  { id: "25", slug: "ranthambore",  city: "Ranthambore",  state: "Rajasthan",        country: "India", img: "raj"   },
  dhl:  { id: "26", slug: "dharamshala",  city: "Dharamshala",  state: "Himachal Pradesh", country: "India", img: "hill"  },
  alw:  { id: "27", slug: "alwar",        city: "Alwar",        state: "Rajasthan",        country: "India", img: "raj"   },
  rsh:  { id: "28", slug: "rishikesh",    city: "Rishikesh",    state: "Uttarakhand",      country: "India", img: "hill"  },
  vkl:  { id: "29", slug: "varkala",      city: "Varkala",      state: "Kerala",           country: "India", img: "kerala"},
  mnr:  { id: "30", slug: "munnar",       city: "Munnar",       state: "Kerala",           country: "India", img: "kerala"},
  oty:  { id: "31", slug: "ooty",         city: "Ooty",         state: "Tamil Nadu",       country: "India", img: "south" },
  psk:  { id: "32", slug: "pushkar",      city: "Pushkar",      state: "Rajasthan",        country: "India", img: "raj"   },
  rnk:  { id: "33", slug: "ranikhet",     city: "Ranikhet",     state: "Uttarakhand",      country: "India", img: "hill"  },
  blr:  { id: "34", slug: "bengaluru",    city: "Bengaluru",    state: "Karnataka",        country: "India", img: "blr"   },
  ncr:  { id: "35", slug: "delhi-ncr",    city: "Delhi NCR",    state: "Delhi",            country: "India", img: "ncr"   },
};

const raw: R[] = [
  // ── UDAIPUR ─────────────────────────────────────────────────────────────────
  ["udr", 4,  4,  12, 25858, "Mandovar Mountain Valley Retreat | 4 Room Pet-friendly Suite With Shared Pool"],
  ["udr", 1,  1,  3,  12480, "Godan Terra Nook | 1-Room Suite With Private Balcony"],
  ["udr", 1,  1,  3,  7704,  "Miran by the Lake | Pet-Friendly Boutique Room with Lake View"],
  ["udr", 3,  3,  9,  20320, "Casa Meraki | Country-Style 3-BHK Villa with Private Pool"],
  ["udr", 2,  3,  6,  28602, "Lakemount | 2-BHK Getaway with Private Pool"],
  ["udr", 4,  4,  12, 35466, "Elite Sereno | Luxe 4-BHK Villa With Private Pool & Garden"],
  ["udr", 3,  4,  9,  31358, "Casa Ilios | Country-Style 3-BHK Villa with Private Pool"],
  ["udr", 1,  1,  3,  12732, "Mandovar Mountain Valley Retreat | 1-Room Pet-friendly Suite"],
  ["udr", 10, 11, 30, 62678, "Godan Terra Estate | 10-BHK Riverside Retreat with Pool"],
  ["udr", 6,  7,  18, 47048, "Godan Terra Cove | 6-BHK Retreat with Private Pool"],
  ["udr", 2,  3,  6,  18160, "Heaven in Hills Kahili | Pet-friendly 2-BHK Villa With Private Pool"],

  // ── JAIPUR ──────────────────────────────────────────────────────────────────
  ["jpr", 1,  1,  3,  13354, "Hathnoda Bagh Lagoon | Cottage within Mini Resort with Bathtub"],
  ["jpr", 2,  3,  6,  17390, "Jamun Farms | 2-BHK Retreat With Private Pool, Garden & Balcony"],
  ["jpr", 6,  6,  16, 67358, "Fernwood | 6-BHK Stone-Clad Estate with Bamboo Cottages"],
  ["jpr", 5,  5,  15, 36610, "Nirvana Farms | Heritage-Style 5-BHK Farmhouse with Private Pool"],
  ["jpr", 4,  4,  12, 35490, "24 Carat | 4-BHK Villa with Private Pool, Cabana, Garden"],
  ["jpr", 8,  8,  24, 49578, "Angelo's Farm | Pet-Friendly 8-BHK Villa with Private Pool"],
  ["jpr", 4,  5,  12, 34960, "Belvedere Villa | Chic 4-BHK Retreat with Pool & Bar"],
  ["jpr", 1,  1,  3,  13354, "Hathnoda Bagh Cascade | Cottage with Open Shower"],
  ["jpr", 4,  4,  10, 33900, "Lush Haven | Chic 4-BHK Retreat with Private Pool"],
  ["jpr", 4,  4,  12, 30166, "El Bosque | Spacious 4-BHK Villa With Private Pool"],
  ["jpr", 4,  4,  12, 51454, "Earthstone | 4-BHK Stone Retreat with Private Pool"],
  ["jpr", 5,  6,  14, 30204, "Echoes by the Aravalli | Pet-friendly 5-BHK Villa"],
  ["jpr", 4,  5,  12, 52574, "The Kanota Retreat | 4-BHK Villa Near Kanota Dam"],
  ["jpr", 3,  4,  9,  31714, "Villa Fiorita | Mediterranean-Style 3-BHK Pet-friendly Villa"],
  ["jpr", 3,  3,  9,  35658, "Haven Villa | 3-BHK Villa With Swimming Pool"],
  ["jpr", 4,  5,  12, 29894, "Ramalaya 4BHK Villa | Most In Demand"],
  ["jpr", 4,  4,  12, 19180, "Fable Farm | Pet-friendly 4-BHK Villa with Private Pool"],
  ["jpr", 4,  4,  12, 34322, "JSP Farm | 4-BHK Farmstay with Private Pool & Jacuzzi"],
  ["jpr", 1,  1,  2,  11828, "Gold Palm Granola | Elegant Room in Serene Resort"],
  ["jpr", 1,  1,  4,  11828, "Gold Palm Macaroon | Family Suite in Serene Resort"],
  ["jpr", 3,  3,  6,  15412, "Lamp House | 3-BHK Villa With Outdoor Jacuzzi"],
  ["jpr", 1,  1,  3,  13380, "Gold Palm Ivory | Sophisticated Room with Bathtub"],
  ["jpr", 1,  1,  3,  5104,  "Ramalaya | 1-Room | Library | Balcony"],
  ["jpr", 8,  9,  18, 38480, "Ramalaya | 8-BHK Getaway With Serene Courtyard"],
  ["jpr", 2,  2,  8,  34610, "Ramgarh Wild Retreat | Pet-friendly Colonial-Style 2-BHK"],
  ["jpr", 5,  7,  15, 42900, "Skylark Estate | 5-BHK Forest-View Villa with Private Pool"],
  ["jpr", 3,  4,  9,  26918, "Laurels Villa | 3-BHK Villa With Private Pool & Bonfire Deck"],
  ["jpr", 5,  5,  15, 56780, "Bargoti Villa | 5-BHK Villa with Private Swimming Pool"],

  // ── KASAULI ─────────────────────────────────────────────────────────────────
  ["ksl", 4,  6,  10, 80754, "The Royce Daisy | Ultra-Luxe 4-BHK Villa With Heated Pool"],
  ["ksl", 4,  6,  10, 88732, "The Royce Rose | Hillside 4-BHK Villa With Private Heated Pool"],
  ["ksl", 4,  4,  8,  60398, "The Retreat Villa | 4-BHK Hillside Retreat with Indoor Pool"],
  ["ksl", 4,  4,  10, 56662, "The Royce Silver Oak Imperial | Pet-Friendly 4-BHK Apartment"],
  ["ksl", 2,  2,  5,  32688, "The Royce Silver Oak Opal | Pet-Friendly 2-BHK Apartment"],
  ["ksl", 4,  6,  10, 78512, "The Royce Orchid | Luxe 4-BHK Hilltop Villa With Jacuzzi"],
  ["ksl", 4,  5,  10, 59818, "Royce Cottage | Luxe Hilltop 4-BHK Retreat With Indoor Bar"],
  ["ksl", 9,  9,  23, 71032, "Konifer Greyvine | Hillside 9-BHK Retreat with Attic"],
  ["ksl", 3,  4,  8,  32416, "Dilli House | 3-BHK Rooftop Villa with Private Plunge Pool"],
  ["ksl", 3,  4,  6,  30298, "Beyond the Curb | 3-BHK Villa with Private Jacuzzi"],
  ["ksl", 4,  4,  8,  33880, "Aaram Bagh | Pet-friendly 4-BHK Escape Amid Pine Forests"],
  ["ksl", 4,  4,  8,  33560, "Kavya Villa | 4-BHK Pet-friendly Villa With Lounge"],
  ["ksl", 2,  2,  5,  19894, "Konifer Wild Fern | Hilltop 2-BHK Retreat"],
  ["ksl", 5,  5,  12, 37374, "Kosh Villa | 5-BHK Villa With Rooftop Terrace"],
  ["ksl", 1,  1,  3,  8012,  "Pine View Resort | Pet-friendly Hilltop 1-Suite"],
  ["ksl", 1,  1,  3,  6420,  "Maharaj Secret Escape | Luxury Pet-Friendly Room"],
  ["ksl", 2,  2,  4,  15102, "Kosh Villa Pinevale | 2-BHK Villa With Pool Table"],
  ["ksl", 3,  2,  5,  16780, "Swaran Secret Escape | Pet-Friendly 2-BHK Apartment with Attic"],
  ["ksl", 1,  1,  3,  15028, "Konifer Rosewood | Hillside Attic Room With Balcony"],
  ["ksl", 3,  3,  8,  31568, "Kosh Villa Glenhaven | 3-BHK Villa with Private Balconies"],
  ["ksl", 3,  3,  7,  31780, "Alaya Stays Golden Meadow Villa | Pet-friendly Hillside 3-BHK"],
  ["ksl", 6,  6,  15, 39714, "Archee's Villa | Pet-friendly 6-BHK with Gaming Zone"],
  ["ksl", 3,  4,  8,  16684, "Captain's Nest | 3-BHK Hilltop Hideaway With Garden"],
  ["ksl", 4,  4,  11, 32416, "Cloudcatcher | 4-BHK Pet-Friendly Villa With Outdoor Seating"],
  ["ksl", 1,  1,  3,  5914,  "Dilli Suites Blush | Hillside Room With AC & Common Pool"],
  ["ksl", 3,  3,  7,  19862, "Kasauli Woods Cottage | Hillside 3-BHK Retreat"],
  ["ksl", 0,  4,  7,  16684, "Mehar Villa | 3-BHK Hillside Retreat With Garden"],
  ["ksl", 1,  2,  3,  5174,  "Serene Woods Hotel | 1-Room Retreat With Balcony"],
  ["ksl", 3,  3,  7,  14600, "Pine View Cottage | Pet-friendly 3-BHK Himalayan Retreat"],
  ["ksl", 1,  1,  3,  11534, "Suro Woodbine Chalet | Pet-friendly Suite With Balcony"],
  ["ksl", 1,  1,  3,  13210, "Suro Woodcrest Chalet | Pet-friendly Stay With Loft"],
  ["ksl", 3,  3,  6,  27104, "Mist & Manor Cedar | Pet-friendly 3-BHK Apartment"],
  ["ksl", 6,  6,  12, 60156, "Mist & Manor Maple | Pet-friendly 6-BHK Apartment"],
  ["ksl", 5,  6,  13, 34076, "Querencia | Pet-friendly 5-BHK Villa With Sunset & Hill Views"],

  // ── LONAVALA ────────────────────────────────────────────────────────────────
  ["lon", 6,  7,  14, 77256,  "Villa 39 | Serene Pet-friendly 6-BHK Getaway With Private Pool"],
  ["lon", 3,  3,  9,  51452,  "Eulophia Paradise | Luxurious 3-BHK Retreat with Private Pool"],
  ["lon", 4,  4,  8,  60534,  "Sakura Villa | Japanese-Themed 4-BHK Villa with Private Pool"],
  ["lon", 5,  6,  12, 113610, "Nimishka Villa | 5-BHK Haven With Private Pool"],
  ["lon", 4,  5,  12, 59020,  "RK Villa | 4-BHK Hideaway with Private Pool"],
  ["lon", 4,  4,  10, 113502, "Meraki Villa | Majestic 4-BHK Glass Villa With Private Pool"],
  ["lon", 3,  4,  10, 31922,  "Aamy Villa | Charming Pet-friendly 3-BHK Villa With Private Pool"],
  ["lon", 4,  5,  12, 59020,  "SK Villa | 4-BHK Retreat with Private Pool"],
  ["lon", 4,  5,  12, 56242,  "Imperial Calista | 4-BHK with Common Pool & Garden"],
  ["lon", 3,  4,  8,  39346,  "Adarsh Villa 1 | Elegant Pet-friendly 3-BHK Villa With Private Pool"],
  ["lon", 5,  6,  15, 70304,  "Imperial Mystara | 5-BHK with Common Pool & Garden"],
  ["lon", 3,  4,  9,  42184,  "Imperial Serenia | 3-BHK with Common Pool & Garden"],
  ["lon", 3,  3,  8,  43720,  "Lavender Hills | Pet-friendly Hillside 3-BHK Villa With Private Pool"],
  ["lon", 1,  1,  3,  18778,  "Moonstone Meadows Suite | 1-Room With Shared Pool"],
  ["lon", 4,  4,  12, 53808,  "Rainmist Villa | 4-BHK Pet-friendly Villa with Private Pool"],
  ["lon", 3,  4,  9,  42374,  "Rosalia | 3-BHK Villa With Shared Pool and Lawn"],
  ["lon", 4,  5,  10, 49942,  "Nest | 4-BHK | Pool | Terrace | Gazebo"],

  // ── BHIMTAL ─────────────────────────────────────────────────────────────────
  ["bhm", 2,  2,  6,  45400, "Antarmann Casa Ember | 2-BHK | Terrace | Lake View"],
  ["bhm", 4,  4,  12, 60534, "Casa Gaula | 4-BHK Cottage with Lawn"],
  ["bhm", 3,  4,  8,  30266, "The Nakshatra | 3-BHK Villa With Lounge"],
  ["bhm", 2,  2,  4,  21188, "Cozy Nest | 2-BHK | Garden | Balcony"],
  ["bhm", 1,  1,  2,  11266, "Kingdom Heartz | 1-BHK Apartment With Balcony"],
  ["bhm", 2,  2,  4,  15396, "Kingdom Heartz | Elegant 2-BHK Apartment With Balcony"],
  ["bhm", 1,  1,  2,  9764,  "Kingdom Heartz | Cosy Studio Apartment With Balcony"],
  ["bhm", 4,  4,  12, 52362, "Irayna | 4-BHK | Garden & Lake View | Studio Room"],

  // ── MUSSOORIE ───────────────────────────────────────────────────────────────
  ["msr", 1,  1,  2,  17758, "Zephyr Classic Hut | Scenic Hill Getaway"],
  ["msr", 1,  1,  2,  35050, "Zephyr Bliss | Premium Hillview Room"],
  ["msr", 1,  1,  3,  21964, "Zephyr Kumaon Cottage | Hillside Retreat"],
  ["msr", 1,  1,  2,  17758, "Zephyr Classic Tent | Hillview Haven"],
  ["msr", 2,  2,  5,  79450, "Zephyr Sierra | 2-BHK Hillside Villa"],
  ["msr", 1,  1,  2,  35050, "Zephyr Heaven | Hillview Premium Room"],
  ["msr", 1,  1,  2,  19626, "Zephyr Imperial | Luxury Tent on Hills"],
  ["msr", 1,  1,  3,  21030, "Zephyr Stoneva | Peaceful Mountain Retreat"],
  ["msr", 1,  1,  3,  21030, "Zephyr Timberhill | Tranquil Hilltop Escape"],
  ["msr", 1,  1,  2,  35050, "Zephyr Utopia | Premium Hillview Room"],
  ["msr", 2,  2,  6,  31780, "Evara | 2-BHK Pet-friendly Hideaway With Balcony & Fireplace"],
  ["msr", 1,  1,  2,  17028, "Snowdrop Glamps | Pet-Friendly Dome Cottage"],
  ["msr", 3,  3,  6,  27838, "Snowdrop Retreat | Pet-friendly 3-BHK Apartment"],
  ["msr", 4,  4,  10, 48106, "Evara | Serene Pet-friendly 4-BHK Hill Retreat"],

  // ── NORTH GOA ───────────────────────────────────────────────────────────────
  ["ngoa", 6,  8,  14, 134600, "Villa Fleuve | 6-BHK By the River With Infinity Pool"],
  ["ngoa", 3,  4,  8,  71040,  "House of Neptune | 3-BHK Cottage with Gazebo & Bar"],
  ["ngoa", 4,  6,  10, 47260,  "Amayah Rasa | Pet-friendly 4-BHK With Steam Room"],
  ["ngoa", 4,  5,  10, 119542, "Suntuarios Casa Ikkebana | 4-BHK | Private Pool | Jacuzzi | Bar"],
  ["ngoa", 4,  4,  10, 119542, "Suntuarios Casa Ivy | 4-BHK | Private Pool | Jacuzzi | Gazebo | Lift"],
  ["ngoa", 4,  5,  10, 119542, "Suntuarios Casa Iris | 4-BHK | Private Pool | Jacuzzi | Gazebo"],
  ["ngoa", 3,  3,  8,  40498,  "Casa Da Sol | 3-BHK Villa with Private Pool"],
  ["ngoa", 6,  6,  14, 62184,  "Amayah Vayu | Two 3-BHKs Indo-Portuguese Escape With Common Pool"],
  ["ngoa", 3,  3,  7,  37688,  "Amayah Neer | Serene 3-BHK Heritage Villa"],
  ["ngoa", 3,  4,  7,  48088,  "Bogenvilla | Luxe 3-BHK Villa Near Popular Beaches"],
  ["ngoa", 4,  5,  10, 59228,  "Casa Del Mar | Elegant 4-BHK Villa with Pool & Bars"],
  ["ngoa", 4,  5,  10, 51446,  "Maison 10 | Luxe 4-BHK Villa With Private Pool"],
  ["ngoa", 4,  4,  10, 62326,  "Opalys | 4-BHK | Private Pool & Garden | Lift"],
  ["ngoa", 4,  5,  11, 52904,  "Casa Verdea | 4-BHK Villa With Private Pool & Lift"],
  ["ngoa", 6,  6,  18, 77288,  "Casa Florencia | Two Exotic 3-BHK Retreats With Pool"],
  ["ngoa", 5,  6,  12, 74030,  "Solace AquaVista | 5-BHK Villa with Private Pool"],
  ["ngoa", 5,  7,  12, 148778, "Casa Ritzy | Indo-Portuguese 5-BHK Villa With Private Pool"],
  ["ngoa", 4,  4,  11, 59224,  "PinkSky | 4-BHK | Private Pool, Bar & Gazebo"],
  ["ngoa", 3,  3,  8,  42048,  "Casa Vilson | 3-BHK Villa With Private Pool & Indoor Bar"],
  ["ngoa", 4,  5,  11, 59224,  "Lumin | 4-BHK | Private Pool | Garden | Bar"],
  ["ngoa", 4,  5,  10, 59812,  "Fernweh | 4-BHK Villa with Private Pool, Garden, Gazebo"],
  ["ngoa", 3,  3,  8,  40806,  "Casa Lotus | 3-BHK Villa with Private Pool"],
  ["ngoa", 4,  5,  12, 62184,  "Casa Del Mundo | Luxe Pet-friendly 4-BHK Villa With Private Pool"],
  ["ngoa", 5,  7,  12, 65804,  "Solace Teal | Charming Pet-friendly 5-BHK Getaway With Private Pool"],
  ["ngoa", 5,  5,  12, 83750,  "Vacasa | 5-BHK | Private Pool & Lift | Pet-friendly"],
  ["ngoa", 5,  7,  12, 127122, "Valley View | 5-BHK Villa With Private Pool"],
  ["ngoa", 3,  3,  7,  40188,  "Villa Judiline | Elegant Pet-friendly 3-BHK Villa With Private Pool"],
  ["ngoa", 3,  3,  8,  40188,  "Villa Valerie | Pet-friendly 3-BHK Villa With Private Pool"],
  ["ngoa", 3,  4,  10, 74030,  "Villa Seine | Indo-Portuguese 3-BHK Villa With Private Pool"],
  ["ngoa", 4,  5,  10, 77674,  "Villa Verde | 4-BHK Luxury Villa with Private Pool"],
  ["ngoa", 3,  3,  7,  53844,  "Mirai Leo | Exquisite 3-BHK Villa Near Vagator Beach"],
  ["ngoa", 3,  4,  7,  52370,  "Amayah Tattva | 3-BHK Escape With Steam Room"],
  ["ngoa", 2,  2,  6,  30954,  "Emperor Ozran 2-BHK Duplex | Retreat With Balconies"],
  ["ngoa", 3,  3,  8,  37692,  "Cavalo Marinho | 3-BHK Villa with Private Pool"],
  ["ngoa", 4,  5,  9,  47378,  "Casa do Mar | Heritage Portuguese 4-BHK Villa With Private Pool"],
  ["ngoa", 4,  5,  10, 44144,  "Villa Plume | 4-BHK Villa with Private Pool"],
  ["ngoa", 1,  1,  3,  20656,  "Peace & Calm | Room with River-View Balconies"],
  ["ngoa", 1,  1,  2,  11762,  "Veera Marina | Elegant 1-BHK Apt With Common Pools"],
  ["ngoa", 1,  1,  3,  12844,  "Emperor Ozran | Premium Rooms With Private Balconies"],
  ["ngoa", 1,  1,  3,  14704,  "Emperor Ozran Superior | Room With Common Pool"],
  ["ngoa", 1,  1,  3,  19904,  "Kamerios Maris | 1-BHK | Jacuzzi | Common Rooftop Pool"],
  ["ngoa", 1,  1,  3,  11340,  "Gracias Aquora | 1-Room Retreat With Private Balcony"],
  ["ngoa", 1,  1,  3,  16148,  "Emperor Ozran Premium | Room With Bathtub"],
  ["ngoa", 1,  1,  4,  26290,  "House of Neptune | 1-BHK Cottage Near Ashwem Beach"],
  ["ngoa", 9,  10, 24, 179466, "Villa Riviere | 9-BHK Private Estate With Pool"],

  // ── DELHI NCR ───────────────────────────────────────────────────────────────
  ["ncr", 2,  2,  4,  35670,  "Raha Farms | 2-BHK Pet-friendly Retreat"],
  ["ncr", 6,  7,  18, 181604, "Heaven Farm | Pet-friendly 6-BHK Manor With Private Pool"],
  ["ncr", 1,  1,  3,  21232,  "Kimaya Kove | Hut-Style Cottage with Open-Air Shower"],
  ["ncr", 1,  1,  3,  26328,  "Kimaya Azora | Luxe Suite with Private Plunge Pool"],
  ["ncr", 5,  6,  15, 95342,  "Levante Farms | 5-BHK Villa With Private Pool, Bar, Garden"],
  ["ncr", 1,  1,  3,  27832,  "Raha Farms | 1 Cottage With Common Pool"],
  ["ncr", 1,  1,  3,  15622,  "Aanandam Villas and Resort | Cottage With Private Plunge Pool"],
  ["ncr", 4,  6,  12, 90802,  "Gardenia | 4-BHK Farmhouse with Private Pool & Game Zone"],
  ["ncr", 3,  4,  9,  121070, "Aravalli Reserve The Bliss | Pet-friendly 3-BHK Villa"],
  ["ncr", 3,  4,  9,  68252,  "House of Tvara | Pet-friendly 3-BHK Villa With Private Pool"],
  ["ncr", 2,  2,  6,  69992,  "Prassanam Vatika | 2-BHK Hillside Villa with Private Pool"],
  ["ncr", 5,  6,  15, 67986,  "AdhiVa Retreat | 5-BHK Pet-friendly Farmhouse With Private Pool"],
  ["ncr", 4,  4,  15, 78696,  "Raj Farm | 3-BHK Villa with Private Pool"],
  ["ncr", 4,  5,  12, 85126,  "Varsha Greens | 4-BHK Retreat on 0.8-Acre Land With Private Pool"],
  ["ncr", 3,  4,  12, 79452,  "Handa's Gateway | Pet-friendly 3-BHK Retreat With Private Pool"],
  ["ncr", 3,  4,  10, 41718,  "Amber Villa | 3-BHK Retreat With Private Pool & Game Room"],
  ["ncr", 2,  1,  6,  34390,  "Raha Farms | 1 Duplex on 5.5-Acre Land"],
  ["ncr", 5,  6,  17, 77182,  "Zenora | Pet-friendly 5-BHK Farmhouse With Private Pool"],
  ["ncr", 4,  4,  12, 84956,  "Vedaaz Farms | Pet-friendly 4-BHK Farmhouse With Private Pool"],
  ["ncr", 4,  5,  11, 56902,  "Aarul Farm | 4-BHK With Private Pool, Gazebos & Game Zone"],
  ["ncr", 1,  1,  3,  12016,  "Aanandam Villas Resort | Executive Suite With Shared Pool"],
  ["ncr", 1,  1,  3,  9314,   "Aanandam Villas Resort | Standard Room With Shared Pool"],
  ["ncr", 1,  1,  2,  14722,  "Aanandam Villas Resort | Super Deluxe Room"],
  ["ncr", 1,  1,  3,  11566,  "Aanandam Villas Resort | Cottage With Shared Pool"],
  ["ncr", 3,  4,  9,  121070, "Aravalli Reserve The Isley | Pet-friendly 3-BHK Villa"],
  ["ncr", 5,  0,  15, 51514,  "Ashirwad Farms | Pet-friendly 5-BHK Retreat"],
  ["ncr", 2,  2,  6,  64318,  "Raga | 2-BHK | Private Pool | Garden | Gazebo"],
  ["ncr", 4,  4,  12, 49456,  "Luxe FarmAcre | Pet-friendly 4-BHK Villa With Private Pool"],
  ["ncr", 3,  4,  9,  36322,  "Dacha | Serene 3-BHK Escape With Garden & Jacuzzi"],
  ["ncr", 5,  7,  13, 52060,  "Tranquil Meadows | 5-BHK Farmhouse with Private Pool"],
  ["ncr", 4,  4,  9,  36322,  "Aravali Woods Villa | 4-BHK | Home Theater | Gaming Room"],
  ["ncr", 3,  4,  9,  121070, "Aravalli Reserve The Lotus | 3-BHK Villa with Private Pool"],
  ["ncr", 4,  5,  12, 121070, "ASK Farms | Refined 4-BHK Villa with Theatre Lounge"],
  ["ncr", 4,  4,  12, 51452,  "Aravale Farm | Pet-friendly 4-BHK Farmhouse With Private Pool"],
  ["ncr", 4,  4,  12, 66586,  "Amaltas | 4-BHK Countryside Hideaway With Private Pool"],
  ["ncr", 4,  4,  8,  58416,  "Aurea | 4-BHK Farmhouse With Private Pool"],
  ["ncr", 3,  3,  10, 38742,  "Rathore Farm | Pet-friendly 3-BHK Farmhouse With Private Pool"],
  ["ncr", 1,  1,  2,  10832,  "Emperor Palms | Emperor Room | Restaurant | Lift"],
  ["ncr", 3,  2,  10, 46310,  "Saroja Farm | Pet-friendly 3-BHK Farmhouse With Private Pool"],
  ["ncr", 3,  3,  9,  41768,  "Lustra | 3-BHK Farmhouse With Private Pool & Lawn"],
  ["ncr", 2,  3,  6,  30570,  "Ratikara Ullaas | 2-BHK with Private Pool"],
  ["ncr", 1,  1,  2,  11736,  "Emperor Palms | Executive Room | Restaurant | Lift"],
  ["ncr", 4,  4,  12, 58568,  "Pranita Farm | 4-BHK Villa with Private Pool"],
  ["ncr", 2,  2,  8,  15772,  "Zinnia | 2-BHK Apartment With Shared Gaming Zone"],
  ["ncr", 2,  2,  6,  13468,  "Radhika Villa | 2-BHK Villa close to Gaur City Mall"],
  ["ncr", 1,  1,  2,  13146,  "Emperor Palms | Premium Room | Restaurant | Lift"],
  ["ncr", 4,  4,  12, 63562,  "Aroma Green | 4-BHK Pet-Friendly Farmhouse With Private Pool"],
  ["ncr", 5,  5,  10, 102908, "JP Farm Stay | 5-BHK Villa Featuring Kids' Room"],
  ["ncr", 1,  1,  3,  15626,  "Malik Farms | Countryside Wooden Cottage on 2 Acre Estate"],
  ["ncr", 2,  3,  8,  35412,  "Royal Green Farm | Pet-friendly 2-BHK Countryside Farmhouse With Private Pool"],

  // ── DUBAI ───────────────────────────────────────────────────────────────────
  ["dxb", 2,  5,  4,  65000,  "2BR Sunset View Suite | Jumeirah Living Marina Gate"],
  ["dxb", 2,  5,  4,  43098,  "2BR in Shams Walk to Beach with Marina View"],
  ["dxb", 2,  3,  4,  88076,  "2BR Suite In Bluewaters with Ain Dubai View"],
  ["dxb", 1,  5,  2,  51268,  "1BR with Sea View in Palm Tower"],
  ["dxb", 1,  5,  2,  35580,  "1BR Paragon Tower | Burj Khalifa & Canal Views"],
  ["dxb", 1,  5,  2,  27566,  "1BR Retreat in Binghatti Nova, JVC"],
  ["dxb", 2,  5,  4,  67950,  "2BR Stunner with Iconic Ain Dubai View"],
  ["dxb", 1,  5,  2,  45578,  "1BR Sea & Skyline Views in Seven Palm"],
  ["dxb", 3,  5,  6,  59362,  "3BR with Marina Views, Near Beach & Marina Mall"],
  ["dxb", 4,  5,  8,  81654,  "3BR + 1 with Burj and Fountain Views"],
  ["dxb", 2,  2,  4,  55392,  "2BR | Full Panoramic Sea View and Beach Access"],
  ["dxb", 1,  5,  2,  40776,  "1BHK with Marina and Partial Sea Views"],
  ["dxb", 1,  1,  2,  39026,  "Bright 1BR | Walk to Beach | Marina Vista Dubai"],
  ["dxb", 5,  5,  9,  149370, "Beachfront Ultra 4BR Duplex | Sea & Burj Views"],
  ["dxb", 2,  2,  4,  56254,  "Classy 2BR with Jacuzzi & Burj Khalifa View"],
  ["dxb", 2,  5,  4,  115042, "Bluewaters 2BR | Iconic Ain Dubai and Sea View"],
  ["dxb", 1,  1,  2,  35240,  "Beachfront Studio with Dining & Leisure Steps Away"],
  ["dxb", 3,  3,  6,  83274,  "3BR Suite with Burj and Fountain Views"],
  ["dxb", 3,  5,  5,  61842,  "Beachfront One JBR Sea Palm Views"],
  ["dxb", 1,  5,  2,  35162,  "Elegant 1BR with Balcony & Skyline Views"],
  ["dxb", 3,  5,  6,  54402,  "3BR with Marina Skyline Views, Near Mall & Metro"],
  ["dxb", 3,  5,  6,  90922,  "3BR at Address JBR with Sea & Ain Dubai Views"],
  ["dxb", 4,  5,  7,  73954,  "3BR Suite next to Dubai Mall with Burj View"],
  ["dxb", 1,  1,  2,  28506,  "Casa Aruri | 1BR Marina Escape"],
  ["dxb", 1,  5,  1,  36154,  "Embrace Luxury and Comfort in Prime 1BR, JLT"],
  ["dxb", 4,  5,  6,  60718,  "Luxury 3BR and Maids Room with Burj View, Steps to Dubai Mall"],
  ["dxb", 1,  5,  2,  42054,  "Oceanic | 1BR - Sea View & Beach Access"],
  ["dxb", 2,  5,  4,  82254,  "Lush 2BR - Sea and Ain View in Address JBR"],
  ["dxb", 1,  1,  2,  20100,  "Modern Studio in JVC, Near Parks and Highways"],
  ["dxb", 1,  1,  4,  41400,  "Modern Retreat in The Views with Balcony & Pool"],
  ["dxb", 2,  2,  4,  52156,  "Elegant 2BR | Creek Beach, Pool & Gym"],
  ["dxb", 2,  2,  4,  54454,  "Modern 2BR with Partial Burj Khalifa View"],
  ["dxb", 1,  5,  2,  29106,  "Modern 1BR in Merano Tower"],
  ["dxb", 1,  5,  2,  30490,  "Perfect 1BR Retreat in the Heart of JVC"],
  ["dxb", 2,  1,  4,  44586,  "High-Floor 2BR | Skyline, Sea & Burj Khalifa View"],
  ["dxb", 2,  3,  4,  42184,  "High Floor 2BR Marina View | Walk to Beach"],
  ["dxb", 1,  1,  2,  33934,  "Seaside Studio in Palm Jumeirah with Beach Access"],
  ["dxb", 1,  5,  2,  33048,  "Stunning 1BR with Marina View And Beach Access"],
  ["dxb", 1,  5,  2,  32892,  "Relaxing 1BR Peaceful Family Living in JVC"],
  ["dxb", 3,  5,  6,  116190, "Premium 3BR with Skyline View in Address Harbor Point"],
  ["dxb", 2,  2,  4,  43150,  "Spacious 2BR in Dubai Marina with Balcony"],
  ["dxb", 3,  3,  6,  59074,  "Upgraded 3BR with Marina View, Near Promenade"],
  ["dxb", 1,  5,  3,  37094,  "Stylish 1BHK in Downtown Dubai"],
  ["dxb", 3,  5,  6,  60274,  "Spacious 3BR in Marina, Steps to the Beach"],
  ["dxb", 1,  5,  2,  39574,  "Stunning 1BR with Palm and Sea Views"],
  ["dxb", 1,  1,  3,  32760,  "Chic High-Floor 1BR in The Greens | Skyline Views"],
  ["dxb", 2,  5,  4,  107446, "Luxury 2BR with Sea, Ain Dubai & Skyline Views"],

  // ── BENGALURU ───────────────────────────────────────────────────────────────
  ["blr", 1,  1,  3,  40228,  "Tapovana Zarae | Pet-friendly Tent on 1-Acre with Shared Pool"],
  ["blr", 2,  2,  8,  115172, "Bali Bay Gumuk | 2-BHK Villa On 2 Acres with Shared Pool"],
  ["blr", 2,  2,  8,  91802,  "Ananta Bliss Taksu | 2-BHK Pet-friendly Villa With Pool"],
  ["blr", 2,  3,  8,  115172, "Bali Bay Cemara | 2-BHK Villa Set on 2 Acres With Pool"],
  ["blr", 3,  3,  9,  90034,  "Tapovana Aroha | Pet-Friendly Boho Retreat With Pool"],
  ["blr", 2,  2,  6,  73442,  "Tapovana Avani | Pet-Friendly 2-BHK Villa with Garden"],
  ["blr", 1,  1,  2,  68946,  "Bali Bay Saung | 1 Earthy Fibre-Clad Tent With Pool"],
  ["blr", 1,  1,  3,  58080,  "Ananta Bliss Bale | Pet-friendly Tent on 1-Acre With Pool"],
  ["blr", 3,  3,  12, 117508, "Ananta Bliss Talam | 3-BHK Pet-friendly Villa With Pool"],
  ["blr", 2,  2,  7,  50074,  "Courtyard Banyan | Rustic 2-BHK Pet-friendly Villa"],
  ["blr", 3,  3,  6,  37388,  "Crest Manor | Countryside 3-BHK Villa With Jacuzzi"],
  ["blr", 1,  1,  3,  10140,  "APR | 1 Pet-friendly Suite Scenic View"],
  ["blr", 5,  5,  10, 37654,  "Royal Valora | Charming 5-BHK Villa"],
  ["blr", 1,  1,  2,  14444,  "Saffron Breeze | 1-Room in Apartment"],
  ["blr", 4,  3,  8,  26704,  "Saffron Breeze | Spacious 4-BHK Apartment"],
  ["blr", 4,  5,  10, 52878,  "SLV Ventures Penthouse | 4-BHK Apartment With Glass House"],
  ["blr", 1,  1,  3,  18778,  "Inara Retreat | Serene Cottage"],
  ["blr", 2,  2,  6,  42730,  "Eco Serenity | Pet-friendly 2-BHK Villa With Lush Garden"],
  ["blr", 2,  2,  4,  17892,  "SLV Ventures Abhignya | 2-BHK Urban Stay"],
  ["blr", 1,  1,  3,  26976,  "Tanira Farms Moonrise | Contemporary Pet-friendly Igloo Cottage"],
  ["blr", 1,  1,  2,  13544,  "SLV Ventures Anagha | 1-BHK Apartment"],
  ["blr", 4,  4,  10, 176930, "Arevana | 3-BHK Villa & Garden Tent with Private Pool"],
  ["blr", 1,  1,  2,  12016,  "Savian Suites Aurel | Twin Beds Room with Balcony"],
  ["blr", 3,  4,  9,  106824, "Saukhyam | Pet-Friendly 3-BHK Farm Villa With Private Pool"],
  ["blr", 1,  1,  3,  12016,  "Savian Suites Eevan | Queen Bed Room with Balcony"],
  ["blr", 1,  1,  4,  20656,  "Savian Suites Avira | Two Beds Room Suite with Balcony"],
  ["blr", 3,  4,  9,  133532, "Sravasthi Villa | 2-BHK Forest-View Villa With Private Jacuzzi"],
  ["blr", 1,  1,  2,  10514,  "Savian Suites Azure | Premium Room with Balcony"],

  // ── SOUTH GOA ───────────────────────────────────────────────────────────────
  ["sgoa", 3,  4,  7,  53840, "Kensho Villas Marigold | 3-BHK With Lift"],
  ["sgoa", 5,  7,  13, 90244, "Kensho Villas Daisy | 5-BHK With Private Pool"],
  ["sgoa", 3,  4,  7,  61296, "Kensho Villas Hibiscus | 3-BHK With Plunge Pool"],
  ["sgoa", 7,  9,  21, 71068, "MidPoint Uno | Pet-friendly 7-Room Retreat with Private Pool"],
  ["sgoa", 1,  1,  3,  20280, "Goan Bliss Executive Suite | Boutique Resort Stay"],
  ["sgoa", 1,  1,  3,  12606, "MidPoint Uno Suite | Pet-friendly 1-Room"],
  ["sgoa", 1,  1,  3,  15396, "Goan Bliss Premium Room | Aesthetic Suite"],
  ["sgoa", 1,  1,  3,  12580, "Goan Bliss Deluxe Room | Boutique Resort Stay"],

  // ── SHIMLA ──────────────────────────────────────────────────────────────────
  ["shl", 4,  6,  19, 46914, "Skylounge | 4-BHK Villa With Panoramic Views"],
  ["shl", 1,  2,  4,  20810, "Everly | Pet-friendly Traditional 1-Bedroom Retreat"],
  ["shl", 3,  5,  15, 40174, "Silvana | Pet-friendly 3-Bedroom Retreat With Attic"],
  ["shl", 1,  1,  3,  14786, "Baljees Melville Utopia Apartments | 1-BHK | Kitchen"],
  ["shl", 3,  3,  8,  23608, "Juniper Holiday In Homestay | 3-BHK Valley-View Apartment"],
  ["shl", 2,  1,  4,  14272, "The Ridgeview Retreat Amelia | Hillside 2-Room Suite"],
  ["shl", 3,  3,  8,  45400, "Hill Top Farmstead | Heritage 3-BHK English-Style Villa"],
  ["shl", 4,  4,  10, 35520, "Fir Holiday In Homestay | 4-BHK Attic Apartment"],
  ["shl", 1,  1,  3,  11642, "The Ridgeview Retreat Arabella | Pet-friendly Hillside Room"],
  ["shl", 1,  1,  2,  11888, "Kail Holiday In Homestay | 1-BHK Hill-View Apartment"],
  ["shl", 2,  2,  4,  18462, "Spurce Holiday In Homestay | 2-BHK Valley-View Apartment"],
  ["shl", 1,  1,  3,  17744, "Baljees Melville Divine Apartments | 1-BHK | Kitchen"],
  ["shl", 1,  1,  2,  9012,  "The Ridgeview Retreat Olivia | Pet-friendly Room"],

  // ── NAINITAL ────────────────────────────────────────────────────────────────
  ["nnl", 3,  3,  9,  66586, "The Meadow | Elegant 3-BHK Hill Retreat"],
  ["nnl", 4,  4,  10, 48428, "Amara Dusk | 4-BHK | Hill Views | Pet friendly"],
  ["nnl", 2,  2,  4,  23608, "Villa Harmony | 2-BHK | Garden | Balcony"],
  ["nnl", 2,  2,  6,  26634, "Karinya Villas Fennel | Hilltop 2-BHK Villa"],
  ["nnl", 2,  1,  4,  27578, "Headingly Suites | Lake-Facing 2-Room Retreat"],
  ["nnl", 1,  1,  2,  9172,  "Amara Aether | 1-Bedroom | Outdoor Sitting Area"],
  ["nnl", 2,  2,  5,  24212, "Amara Twilight | Pet-friendly 2-BHK Retreat"],
  ["nnl", 4,  4,  10, 38136, "Amara Dawn | 4-BHK | Near Nainital Lake"],
  ["nnl", 3,  4,  9,  39346, "Karinya Villas Frond | Scenic Hill View 3-BHK Villa"],
  ["nnl", 1,  1,  3,  14946, "Karinya Villas Fern | Scenic Hill View 1-BHK Villa"],
  ["nnl", 2,  2,  6,  25476, "Key Shree Bhawan | 2-BHK Valley View Apartment"],

  // ── DEHRADUN ────────────────────────────────────────────────────────────────
  ["ddn", 4,  4,  8,  62048, "The Kimadi House | 4-BHK English-Style Villa With Rooftop"],
  ["ddn", 3,  4,  8,  44190, "Serenita Abode | 3-BHK Villa With Plunge Pool"],
  ["ddn", 3,  3,  6,  37532, "Kalyan Mansion Cosmos | Premium 3-BHK Penthouse"],
  ["ddn", 3,  3,  9,  56750, "Baramasa | Pet-friendly 3-BHK Hill Retreat With Pool"],
  ["ddn", 1,  1,  3,  22760, "Alora in the Hills Dewfall | Pet-friendly 1-BHK with Jacuzzi"],
  ["ddn", 3,  4,  7,  42494, "Rahta | 3-BHK Pet-friendly Retreat With Garden"],
  ["ddn", 2,  2,  4,  28536, "Alora in the Hills Cloudveil | Pet-friendly 2-BHK"],
  ["ddn", 1,  1,  2,  12908, "Kalyan Mansion Primrose | Elegant Room W/ Private Balcony"],

  // ── JIM CORBETT ─────────────────────────────────────────────────────────────
  ["jcr", 3,  3,  9,  61140, "Aranya Library Aria | 3-BHK Villa With Kids' Room & Private Pool"],
  ["jcr", 4,  4,  14, 62048, "Puvalgarh Farms | British Style 4-BHK Villa with Pool"],
  ["jcr", 3,  3,  9,  55084, "Aranya Library Zuri | 3-BHK Villa With Private Pool"],
  ["jcr", 1,  1,  2,  21450, "Puvalgarh Farms Thistle | Cottage-style Suite"],
  ["jcr", 1,  1,  2,  12506, "Sylvaara Meadow | Suite with Common Glasshouse Dining"],
  ["jcr", 1,  1,  2,  10140, "Sylvaara Maple | Room with Private Balcony & Restaurant"],
  ["jcr", 6,  7,  18, 92316, "Aranya Library Maison | 6-BHK Villa With Private Pool"],
  ["jcr", 1,  1,  2,  20280, "Sylvaara Canopy | Cottage with Private Pool"],
  ["jcr", 2,  2,  4,  20026, "Dhela Jungle Retreat Cobblestone | Duplex 2-BHK"],
  ["jcr", 1,  1,  2,  11814, "Dhela Jungle Retreat Pebble | Pet-Friendly Suite"],
  ["jcr", 3,  5,  10, 48428, "Farm Naturelle | Serene 3-BHK Farmhouse"],
  ["jcr", 7,  7,  14, 69324, "Dhela Jungle Retreat | Pet-Friendly 2-BHK + 5 Suites"],

  // ── NASHIK ──────────────────────────────────────────────────────────────────
  ["nsk", 2,  2,  4,  44832, "Energise Soul Retreat Karuna Kutir | 2-BHK Villa With Pool"],
  ["nsk", 3,  3,  6,  61292, "Energise Soul Retreat Vishuddha | 3-BHK Villa With Pool"],
  ["nsk", 1,  1,  3,  19716, "Energise Soul Retreat Premium Room | 1-Suite"],
  ["nsk", 4,  4,  8,  76804, "Energise Soul Resort Aranya Angan | 4-BHK Villa With Pool"],
  ["nsk", 3,  3,  6,  65076, "Energise Soul Retreat Anahata Aalaya | 3-BHK Villa With Pool"],
  ["nsk", 3,  3,  6,  69614, "Energise Soul Retreat | 3-BHK Villa With Pool"],
  ["nsk", 3,  3,  6,  80588, "Energise Soul Retreat Ajna | 3-BHK Villa With Pool"],

  // ── KARJAT ──────────────────────────────────────────────────────────────────
  ["krj", 2,  4,  6,  30266, "Heavenly Homes Villa | 2-BHK Villa with Private Pool"],
  ["krj", 4,  5,  12, 60534, "Aaraa Vilas | 4-BHK Luxury Villa with Private Pool"],
  ["krj", 4,  4,  12, 50446, "Lavender Crest | Pet-friendly 4-BHK Villa With Private Pool"],
  ["krj", 4,  4,  12, 45400, "Sreelakam Villa | 4-BHK Hillside Hideaway With Private Pool"],
  ["krj", 4,  4,  12, 42978, "Ansh Villa | Luxury 4-BHK Pet-friendly Villa With Private Pool"],
  ["krj", 4,  4,  8,  40860, "Soulskape Villa | 4-BHK With Private Pool"],

  // ── COORG ───────────────────────────────────────────────────────────────────
  ["crg", 5,  5,  14, 138874, "Tranquility | 5-BHK Pet-Friendly Villa With Pool"],
  ["crg", 1,  1,  2,  16148,  "Avocado Cottages Cozy Room | Pet-friendly Garden Suite"],
  ["crg", 1,  1,  3,  17650,  "Avocado Cottages Executive Room | Pet-friendly Stay"],
  ["crg", 1,  1,  3,  22158,  "Avocado Cottages Deluxe Room | Pet-friendly Stay"],
  ["crg", 1,  1,  3,  24036,  "Avocado Cottages Premium Suite | Pet-friendly Stay"],

  // ── IGATPURI ────────────────────────────────────────────────────────────────
  ["igt", 10, 14, 30, 154362, "VK Villa | 10-BHK Villa with Two Private Pools"],
  ["igt", 6,  6,  18, 83310,  "Lush Villa | 6-BHK Pet-Friendly Villa with Private Pool"],
  ["igt", 3,  5,  9,  35140,  "White House | 3-BHK Villa With Panoramic Hill Views"],
  ["igt", 7,  9,  20, 72188,  "White House | 7-BHK With Panoramic Hill Views"],
  ["igt", 4,  5,  11, 39498,  "White House | 4-BHK Villa With Panoramic Hill Views"],
  ["igt", 1,  1,  3,  15772,  "Timber Premium Suite | Pet-friendly Bamboo Cottage"],
  ["igt", 1,  1,  3,  13146,  "Timber Standard Suite | Pet-friendly Bamboo Cottage"],
  ["igt", 3,  3,  9,  35714,  "GauRi Villa | 3-BHK Villa With Private Pool"],

  // ── MUKTESHWAR ──────────────────────────────────────────────────────────────
  ["mkt", 1,  1,  4,  17464, "Hill Homes Cottages Mauve | 1-Room Suite"],
  ["mkt", 2,  2,  6,  37934, "Hill Homes Cottages Mulberry | 2-BHK Villa"],
  ["mkt", 1,  1,  2,  11240, "Trio's Top | 1 Pet-friendly Room"],
  ["mkt", 2,  1,  6,  18142, "Trio's Top | Hilltop Pet-friendly 2-BHK"],
  ["mkt", 1,  1,  4,  23846, "Hill Homes Cottages Mallow | 1-BHK Villa"],

  // ── ALAPPUZHA ───────────────────────────────────────────────────────────────
  ["alp", 3,  3,  8,  64094, "Breeze and Grains Resort | 3-BHK Vacation Home"],
  ["alp", 1,  1,  3,  13824, "Palliath House | 1-Pond-facing Room"],
  ["alp", 1,  1,  3,  13146, "Palm Dale Premium Room | Heritage Riverside Stay"],
  ["alp", 1,  1,  2,  12580, "Palm Dale Deluxe Room | Pet-friendly Heritage Retreat"],

  // ── CHENNAI ─────────────────────────────────────────────────────────────────
  ["chn", 1,  1,  3,  41838, "Mallai by Elivaas | 1 Suite With Private Garden"],
  ["chn", 2,  2,  4,  86796, "Casa Santorini | Greek Style 2-BHK Villa"],
  ["chn", 1,  1,  3,  23980, "Nila Forrest | Timber Room With Private Pool"],
  ["chn", 2,  2,  6,  43464, "Mira Forrest | Cottage With Private Pool"],

  // ── KOCHI ───────────────────────────────────────────────────────────────────
  ["kch", 5,  5,  11, 64094, "Valiyaveetil Mansion | 5-BHK Mansion With Private Pool"],
  ["kch", 5,  5,  11, 66764, "Vintage Retreat | 5-BHK Riverfront Heritage Villa"],
  ["kch", 3,  3,  7,  40860, "Tales By Tamarind | 200-Year-Old 3-BHK Forest Villa"],
  ["kch", 4,  4,  9,  40058, "Nedumbally | 4-BHK Villa with Office Space"],
  ["kch", 3,  3,  8,  36588, "Mangaly Heritage | 270-Year-Old 3-BHK Authentic Kerala Heritage Villa"],
  ["kch", 3,  3,  14, 40860, "Pochan's Zen | 3-BHK Heritage Home"],

  // ── KOLAD ───────────────────────────────────────────────────────────────────
  ["kld", 1,  1,  3,  18160, "Junglebrooke Standard | Pet-Friendly Master Room with Pool"],
  ["kld", 1,  1,  3,  24212, "Junglebrooke Suite | Suite Room Pet-Friendly Cottage Estate"],
  ["kld", 2,  2,  6,  29662, "Junglebrooke Interconnected | Pet-Friendly Master Rooms With Pool"],
  ["kld", 8,  8,  24, 118042,"Junglebrooke | 8-Room Pet-Friendly Cottage Estate"],
  ["kld", 1,  1,  3,  21188, "Junglebrooke Premium | Suite Room Pet-Friendly Cottage"],

  // ── RANTHAMBORE ─────────────────────────────────────────────────────────────
  ["rnt", 1,  1,  3,  28064, "Tiger Cave Suite | Pet-friendly Room with Shared Pool"],
  ["rnt", 1,  1,  3,  31572, "Tiger Cave Suite | 1-Room with Private Pool"],
  ["rnt", 1,  1,  3,  19500, "Bagh Serai | Pet-friendly Cottage With Plunge Pool"],

  // ── ALIBAUG ─────────────────────────────────────────────────────────────────
  ["alb", 5,  5,  12, 83270, "Casa Mocha | 5-BHK Pet-friendly Retreat With Private Pool"],
  ["alb", 4,  5,  10, 40860, "The Fernstead | Hillview 4-BHK Villa With Private Pool"],
  ["alb", 3,  4,  9,  53724, "Valdivian Villa | 3-BHK with Verandah, Temple and Machan"],

  // ── ALWAR ───────────────────────────────────────────────────────────────────
  ["alw", 3,  3,  9,  47944, "Riveira Hills | 3-BHK Pet-friendly Cottage with Lush Garden"],
  ["alw", 2,  2,  4,  38952, "MS Valley Groves | 2-BHK Villa with Private Pool"],
  ["alw", 3,  3,  6,  48692, "MS Valley Blossoms | 3-BHK Villa with Private Pool"],

  // ── RISHIKESH ───────────────────────────────────────────────────────────────
  ["rsh", 1,  1,  2,  8824,  "Anandam In The Himalayas Indigo | Suite With Restaurant"],
  ["rsh", 1,  1,  2,  8938,  "VanaSutra Resort | 1-Room Retreat On Mini Forest Resort"],

  // ── VARKALA ─────────────────────────────────────────────────────────────────
  ["vkl", 1,  1,  2,  13520, "Still Waters Club Room | 1-Room with Restaurant"],
  ["vkl", 1,  1,  3,  13934, "Still Waters Premium Suite | Lakeside Stay"],

  // ── MUNNAR ──────────────────────────────────────────────────────────────────
  ["mnr", 4,  4,  10, 45400, "Kayyath Valley | 4-BHK Villa With Scenic Mountain View"],
  ["mnr", 4,  4,  10, 37388, "Jai Hill | 4-Room Cottage With Garden and Outdoor Dining"],

  // ── OOTY ────────────────────────────────────────────────────────────────────
  ["oty", 3,  3,  6,  28844, "Cleft | 3-BHK With Garden, Picturesque Verandah & Balcony"],

  // ── PUSHKAR ─────────────────────────────────────────────────────────────────
  ["psk", 5,  5,  15, 79780, "Tuscan Villa | 5-BHK Pet-Friendly Retreat with Private Pool"],
  ["psk", 7,  10, 21, 74912, "Krishna Serenity Villa | 7-BHK Farmhouse with Private Pool"],

  // ── RANIKHET ────────────────────────────────────────────────────────────────
  ["rnk", 3,  3,  9,  24516, "SnowPeak Villa | 3-BHK Pet-friendly Hideaway"],

  // ── DHARAMSHALA ─────────────────────────────────────────────────────────────
  ["dhl", 1,  1,  3,  15022, "Esh Cottage Hazel | 1 Hillview Suite With Shared Pool"],
];

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function mkSlug(name: string, cslug: string, idx: number): string {
  const base = slugify(name.split("|")[0].trim()).substring(0, 50).replace(/-+$/, "");
  return `${base}-${cslug}-eli${String(idx).padStart(3, "0")}`;
}

function mkType(name: string): Property["property_type"] {
  const n = name.toLowerCase();
  if (n.includes("penthouse")) return "penthouse";
  if (n.includes("estate")) return "estate";
  if (n.includes("retreat") && !n.includes("bhk")) return "retreat";
  if (n.includes("bungalow")) return "bungalow";
  return "villa";
}

function mkPool(name: string): boolean {
  const n = name.toLowerCase();
  if (n.includes("pool table") || n.includes("pool hall")) return false;
  return n.includes("pool") || n.includes("plunge") || n.includes("jacuzzi");
}

function mkAmenities(name: string, beds: number, hasPool: boolean): string[] {
  const n = name.toLowerCase();
  const amenities: string[] = ["WiFi", "Air Conditioning", "Daily Housekeeping"];
  if (hasPool) amenities.push("Private Pool");
  if (n.includes("jacuzzi")) amenities.push("Jacuzzi");
  if (n.includes("bar")) amenities.push("Bar");
  if (n.includes("garden")) amenities.push("Garden");
  if (n.includes("terrace") || n.includes("rooftop")) amenities.push("Terrace");
  if (n.includes("gazebo")) amenities.push("Gazebo");
  if (n.includes("balcony")) amenities.push("Balcony");
  if (n.includes("fireplace")) amenities.push("Fireplace");
  if (n.includes("game") || n.includes("gaming")) amenities.push("Game Zone");
  if (n.includes("theater") || n.includes("theatre")) amenities.push("Home Theatre");
  if (n.includes("kitchen")) amenities.push("Kitchen");
  if (n.includes("pet")) amenities.push("Pet Friendly");
  if (beds >= 4) amenities.push("Chef on Request");
  if (beds >= 3) amenities.push("Concierge Service");
  amenities.push("Parking");
  return amenities;
}

function mkDesc(name: string, city: string, beds: number, guests: number): string {
  const title = name.split("|")[0].trim();
  return `${title} is a stunning property in ${city}, accommodating up to ${guests} guests across ${beds} beautifully appointed bedroom${beds !== 1 ? "s" : ""}. Experience luxury and comfort in one of ${city}'s most sought-after retreats, with world-class amenities and impeccable service.`;
}

const counters: Record<string, number> = {};
const fallbackCounters: Record<string, number> = {};

export const elivaasProperties: Property[] = raw.map(
  ([ck, beds, baths, guests, ePrice, name]) => {
    const conf = C[ck];
    counters[ck] = (counters[ck] || 0) + 1;
    const idx = counters[ck];
    const hasPool = mkPool(name);
    const rawTitle = name.split("|")[0].trim();
    const title = rawTitle.length > 80 ? rawTitle.substring(0, 77) + "..." : rawTitle;

    // Per-property images (scraped from Elivaas) with stride-3 pool fallback
    let images: string[];
    const propImgs = PROP_IMGS[`${ck}:${idx - 1}`];
    if (propImgs && propImgs.length > 0) {
      images = propImgs.map(CDN);
    } else {
      fallbackCounters[ck] = (fallbackCounters[ck] || 0);
      const fi = fallbackCounters[ck]++;
      const pool = IMGS[conf.img];
      const n = pool.length;
      const start = (fi * 3) % n;
      images = [pool[start], pool[(start + 1) % n], pool[(start + 2) % n]];
    }

    return {
      id: `${conf.slug}-eli-${String(idx).padStart(3, "0")}`,
      slug: mkSlug(name, conf.slug, idx),
      code: `SC-${ck.toUpperCase()}-${String(idx).padStart(3, "0")}`,
      title,
      destination_id: conf.id,
      destination_slug: conf.slug,
      city: conf.city,
      country: conf.country,
      ...(conf.state ? { state: conf.state } : {}),
      bedrooms: beds,
      bathrooms: baths,
      max_guests: guests < 1 ? 2 : guests,
      has_pool: hasPool,
      property_type: mkType(name),
      description: mkDesc(name, conf.city, beds, guests < 1 ? 2 : guests),
      short_description: `${beds}-bedroom property in ${conf.city} for up to ${guests < 1 ? 2 : guests} guests`,
      amenities: mkAmenities(name, beds, hasPool),
      images,
      featured: false,
      price_on_request: ePrice === 0,
      ...(ePrice > 0 ? { starting_price: Math.round((ePrice - 500) / 2) } : {}),
    };
  }
);
