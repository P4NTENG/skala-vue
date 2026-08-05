<script setup>
import '@fontsource/staatliches'
import '@fontsource/jaro'
import { Icon } from '@iconify/vue'
import wordmarkSvg from '/assets/about/wordmark.svg'
import borderSvg from '/assets/about/decorative-border.svg'

defineOptions({ name: 'AboutView' })

const navLinks = ['About', 'Find Stocklists', 'Contact']
</script>

<template>
  <div class="min-h-screen w-full overflow-x-hidden">
    <!-- ═══════════════════════════════════════════════ -->
    <!-- DESKTOP 1280px                                  -->
    <!-- ═══════════════════════════════════════════════ -->
    <div class="mx-auto flex w-full max-w-[1280px] flex-col items-stretch bg-[#FFFFFF]">
      <!-- ═══ HEADER ═══ -->
      <!-- Figma: instance Header, layout: column, alignSelf stretch -->
      <header class="flex w-full flex-col items-stretch">
        <!-- Navigation: row, alignSelf stretch, padding 60px 30px 30px, gap 70px -->
        <div class="flex w-full flex-row gap-[70px] px-[30px] pb-[30px] pt-[60px]">
          <!-- Wordmark: row, justify center, align flex-end, gap 8px, fill, height 154.71px -->
          <div class="flex h-[154.71px] flex-1 items-end justify-center gap-2">
            <img :src="wordmarkSvg" alt="SKALA" class="h-[192.97px] w-auto text-[#0F0F0F]" />
          </div>
          <!-- Lockup: column, alignSelf stretch, padding 0px 30px 0px 0px, space-between, fill -->
          <div class="flex flex-1 flex-col justify-between self-stretch pr-[30px]">
            <!-- Tagline: Heading 3 = Staatliches 30px, 1.3em, 0.01em -->
            <p
              class="font-[Staatliches] text-[30px] leading-[1.3] tracking-[0.01em] text-[#000000]"
            >
              The ZERO-PROOF aperitif for modern living.
            </p>
            <!-- Links: row, alignSelf stretch, padding 8px 0px, space-between, divider top 0.5px #000000 -->
            <div class="flex w-full flex-row justify-between border-t border-black/50 px-0 py-2">
              <a
                v-for="link in navLinks"
                :key="link"
                href="#"
                class="font-[Jaro] text-[26px] uppercase leading-[1.39] tracking-[-0.01em] text-[#000000] hover:opacity-60 transition-opacity"
                >{{ link }}</a
              >
            </div>
          </div>
        </div>
        <!-- Decorative border: SVG, fill, height 32.05px, Accent 1 -->
        <img :src="borderSvg" alt="" class="h-8 w-full text-[#0F0F0F]" />
      </header>

      <!-- ═══ MAIN CONTENT ═══ -->
      <main class="flex w-full flex-col items-stretch">
        <!-- ─── CTA SECTION ─── -->
        <!-- Figma: row, alignSelf stretch, height 540px, image fill cover bg -->
        <section
          class="flex h-[540px] w-full flex-row items-stretch bg-zinc-300 bg-cover bg-center"
        >
          <!-- Text block: column, alignSelf stretch, padding 30px, gap 60px, width 540px, Background 2 -->
          <div
            class="flex h-full w-[540px] flex-col justify-between self-stretch bg-[#CD9D65] p-[30px]"
          >
            <!-- Heading 2 = Staatliches 42px, 1.1em, 0.01em, Headline 1 -->
            <h2
              class="font-[Staatliches] text-[42px] leading-[1.1] tracking-[0.01em] text-[#000000]"
            >
              The only SPIRIT-FREE aperitif that tastes as good as it makes you feel.
            </h2>
            <!-- Button: State=Default -->
            <!-- Ellipse bg: absolute, Accent 1, border 1.3px Accent 1, 158.8x52.2 -->
            <!-- Link text: Jaro 26px, uppercase, Background 2 -->
            <a href="#" class="relative inline-flex w-fit items-center px-[26px] py-[7.8px]">
              <span
                class="absolute inset-0 rounded-full border-[1.3px] border-[#0F0F0F] bg-[#0F0F0F]"
              />
              <span
                class="relative z-10 font-[Jaro] text-[26px] uppercase leading-[1.39] tracking-[-0.01em] text-[#CD9D65]"
                >Shop now</span
              >
            </a>
          </div>
        </section>

        <!-- ─── ABOUT SECTION ─── -->
        <!-- Figma: column, alignSelf stretch, padding 30px 30px 100px, gap 50px, Background 1 -->
        <section
          class="flex w-full flex-col gap-[50px] bg-[#FFFFFF] px-[30px] pb-[100px] pt-[30px]"
        >
          <!-- Inner content: column, gap 50px -->
          <div class="flex flex-col gap-[50px]">
            <!-- Heading 1 = Staatliches 60px, 1.1em, -0.01em, Headline 1 -->
            <p
              class="font-[Staatliches] text-[60px] leading-[1.1] tracking-[-0.01em] text-[#000000]"
            >
              V&eacute;loce is the ZERO-PROOF aperitif for modern living, crafted with super herbs
              and nutraceuticals to elevate your well-being, without compromising the sophisticated
              ritual of the aperitif.
            </p>
            <!-- Button: State=Secondary -->
            <!-- Ellipse bg: absolute, Background 1, border 1px Divider 1, 149.8x52.2 -->
            <a href="#" class="relative inline-flex w-fit items-center px-[26px] py-[7.8px]">
              <span class="absolute inset-0 rounded-full border border-[#000000] bg-[#FFFFFF]" />
              <span
                class="relative z-10 font-[Jaro] text-[26px] uppercase leading-[1.39] tracking-[-0.01em] text-[#0F0F0F]"
                >About Us</span
              >
            </a>
          </div>
        </section>

        <!-- ─── FEATURED PRODUCT ─── -->
        <!-- Figma: column, alignSelf stretch, padding 80px 145px, justify-end, center, gap 8px, height 800px -->
        <!-- Background: rgba(0,0,0,0.2) + image fill cover -->
        <section
          class="flex h-[800px] w-full flex-col items-center justify-end gap-2 bg-zinc-400 bg-cover bg-center px-[145px] pb-[80px] pt-[80px]"
          style="background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))"
        >
          <!-- Circular Tag: 115x44, CSS approximation -->
          <span
            class="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 font-[Jaro] text-xs uppercase tracking-widest text-white/60"
          >
            New
          </span>
          <!-- Header + subhead: column, center, gap 8px -->
          <div class="flex flex-col items-center gap-2">
            <!-- Display Headline = Staatliches 150px, 0.8em, 0.01em, Headline 2 -->
            <h3
              class="font-[Staatliches] text-[150px] leading-[0.8] tracking-[0.01em] text-[#FFFFFF]"
            >
              Primavera
            </h3>
            <!-- Heading 3 (1:6) = Staatliches 22px, 1.45em, 0.01em, center, Body 2 -->
            <p
              class="max-w-[400px] text-center font-[Staatliches] text-[22px] leading-[1.45] tracking-[0.01em] text-[#FFFFFF]"
            >
              A bold, spiced aperitif featuring cardamom, ginger, and cinnamon.
            </p>
          </div>
        </section>

        <!-- ─── PRODUCT GRID ─── -->
        <!-- Figma: column, alignSelf stretch, padding 30px, gap 100px, Background 1 -->
        <section class="flex w-full flex-col gap-[100px] bg-[#FFFFFF] p-[30px]">
          <!-- Products: row, wrap, gap 20px -->
          <div class="flex flex-row flex-wrap gap-5">
            <!-- Product card: column, padding 0px 0px 50px, gap 30px -->
            <div
              v-for="i in 3"
              :key="i"
              class="flex flex-1 flex-col gap-[30px] pb-[50px]"
              style="min-width: 300px"
            >
              <!-- Image placeholder: column, padding 30px, gap 8px, height 600px, image stretch fill -->
              <!-- Figma uses specific cropped images, placeholder bg used -->
              <div class="flex h-[600px] w-full flex-col gap-2 bg-zinc-300 p-[30px]">
                <Icon icon="solar:cup-hot-bold-duotone" class="m-auto size-16 text-zinc-400" />
              </div>
              <!-- Text area: column, padding 0px 60px 0px 0px, gap 30px -->
              <div class="flex flex-col gap-[30px] pr-[60px]">
                <!-- Product name: could be a smaller heading -->
                <!-- Subtitle: smaller text -->
              </div>
            </div>
          </div>
        </section>

        <!-- ─── FLAVORS SECTION ─── -->
        <!-- Figma: column, alignSelf stretch, padding 30px, center, Background 2 -->
        <section class="flex w-full flex-col items-center bg-[#CD9D65] p-[30px]">
          <!-- Display Headline (1:75) = Staatliches 100px, 0.8em, 0.01em, Accent on Bg 2 -->
          <h3
            class="font-[Staatliches] text-[100px] leading-[0.8] tracking-[0.01em] text-[#613B0F]"
          >
            Lavande
          </h3>
          <h3
            class="font-[Staatliches] text-[100px] leading-[0.8] tracking-[0.01em] text-[#613B0F]"
          >
            Spezia
          </h3>
          <h3
            class="font-[Staatliches] text-[100px] leading-[0.8] tracking-[0.01em] text-[#613B0F]"
          >
            Primavera
          </h3>
          <h3
            class="font-[Staatliches] text-[100px] leading-[0.8] tracking-[0.01em] text-[#000000]"
          >
            Find us
          </h3>
        </section>

        <!-- ─── STOCKLIST SECTION ─── -->
        <!-- Figma: row, alignSelf stretch, space-between, height 640px -->
        <section class="flex h-[640px] w-full flex-row justify-between">
          <!-- Text: column, padding 23px 0px, space-between, center, height 640px, Background 1 -->
          <div
            class="flex h-[640px] flex-[1] flex-col items-center justify-between bg-[#FFFFFF] py-[23px]"
          >
            <!-- Heading 2 = Staatliches 42px, 1.1em, 0.01em, Headline 1, width 580px -->
            <p
              class="w-[580px] font-[Staatliches] text-[42px] leading-[1.1] tracking-[0.01em] text-[#000000]"
            >
              Experience the refined taste of V&eacute;loce. Visit our premium stockists for your
              next alcohol-free aperitif.
            </p>
          </div>
          <!-- Image: rectangle, fill, height 640px, image fill cover -->
          <div class="h-[640px] flex-[1] bg-zinc-400 bg-cover bg-center">
            <Icon
              icon="solar:map-point-bold-duotone"
              class="mx-auto mt-[280px] block size-16 text-zinc-500"
            />
          </div>
        </section>
      </main>

      <!-- ═══ FOOTER ═══ -->
      <!-- Figma: column, alignSelf stretch, Background 2 -->
      <footer class="flex w-full flex-col items-stretch bg-[#CD9D65]">
        <!-- Text content: row, alignSelf stretch, padding 30px 30px 0px, space-between, center -->
        <div class="flex w-full flex-row items-center justify-between px-[30px] pt-[30px]">
          <!-- Links: column, padding 0px 0px 120px, gap 7px -->
          <div class="flex flex-col gap-[7px] pb-[120px]">
            <a
              href="#"
              class="font-[Jaro] text-[26px] uppercase leading-[1.39] tracking-[-0.02em] text-[#000000] hover:opacity-60 transition-opacity"
              >Find Stockists</a
            >
            <a
              href="#"
              class="font-[Jaro] text-[26px] uppercase leading-[1.39] tracking-[-0.02em] text-[#000000] hover:opacity-60 transition-opacity"
              >About</a
            >
          </div>
          <!-- Contact info: column, padding 0px 0px 120px, gap 7px -->
          <div class="flex flex-col gap-[7px] pb-[120px] text-right">
            <span
              class="font-[Jaro] text-[26px] uppercase leading-[1.39] tracking-[-0.02em] text-[#000000]"
              >(646) 555-4567</span
            >
            <span
              class="font-[Jaro] text-[26px] uppercase leading-[1.39] tracking-[-0.02em] text-[#000000]"
              >hello@figma.com</span
            >
          </div>
        </div>
        <!-- Wordmark + rights: column, alignSelf stretch, padding 0px 30px 20px, center, gap 17px -->
        <div class="flex w-full flex-col items-center gap-[17px] px-[30px] pb-5">
          <!-- Véloce: Jaro 240.49574px, 0.84em, 0.01em, uppercase, Accent 1 -->
          <span
            class="font-[Jaro] text-[240px] uppercase leading-[0.84] tracking-[0.01em] text-[#0F0F0F]"
          >
            SKALA
          </span>
          <!-- Copyright: Geist Bold 14.22222px, 1.1em, -0.05em, uppercase, Accent 1 -->
          <span
            class="font-bold uppercase leading-[1.1] tracking-[-0.05em] text-[#0F0F0F]"
            style="font-size: 14.222222px"
          >
            Skala Lab &copy; 2025 All Rights Reserved
          </span>
        </div>
        <!-- Decorative border: SVG, Accent 1 -->
        <img :src="borderSvg" alt="" class="h-8 w-full text-[#0F0F0F]" />
      </footer>
    </div>
  </div>
</template>
