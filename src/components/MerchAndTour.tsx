import React, { useState } from 'react';
import { Shirt, Calendar, Users, MapPin, Tag } from 'lucide-react';
import { BandData } from '../types';
import { BandLogo } from './BandLogo';

interface MerchAndTourProps {
  band: BandData;
  coverArtUrl: string;
}

export const MerchAndTour: React.FC<MerchAndTourProps> = ({ band, coverArtUrl }) => {
  const [merchView, setMerchView] = useState<'front' | 'back'>('front');

  return (
    <div className="space-y-8">
      {/* SECTION 1: MERCH & GIG FLYER DUAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* T-SHIRT MOCKUP STUDIO */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shirt className="w-5 h-5 text-red-500" />
                <h4 className="text-lg font-bold font-mono text-white uppercase tracking-tight">
                  Vintage Washed Tour Merch
                </h4>
              </div>

              {/* Front / Back Toggle */}
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
                <button
                  onClick={() => setMerchView('front')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    merchView === 'front' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  FRONT
                </button>
                <button
                  onClick={() => setMerchView('back')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    merchView === 'back' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  BACK (DATES)
                </button>
              </div>
            </div>

            {/* Vintage Washed Oversized Tee Canvas */}
            <div className="relative w-full aspect-[4/5] max-w-[380px] mx-auto bg-[#131316] rounded-2xl border border-zinc-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-6 flex flex-col items-center justify-between overflow-hidden">
              {/* T-Shirt Neck Ribbing Graphic */}
              <div className="w-28 h-10 border-b-4 border-zinc-800 rounded-full mx-auto -mt-3 bg-zinc-950 flex items-center justify-center">
                <span className="text-[7px] font-mono text-zinc-600 uppercase">HEAVYWEIGHT 240GSM</span>
              </div>

              {/* T-shirt Content: FRONT */}
              {merchView === 'front' ? (
                <div className="flex-1 w-full flex flex-col items-center justify-center gap-4 px-4 py-2">
                  <div className="w-full max-w-[240px]">
                    <BandLogo name={band.name} style={band.logoStyle} className="scale-90" />
                  </div>

                  <div className="w-56 h-56 rounded border-2 border-zinc-800 overflow-hidden shadow-2xl relative">
                    <img
                      src={coverArtUrl}
                      alt={band.albumTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter contrast-125"
                    />
                    <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                  </div>

                  <div className="text-center font-mono text-[10px] tracking-widest text-zinc-400 font-bold uppercase">
                    {band.albumTitle}
                  </div>
                </div>
              ) : (
                /* T-shirt Content: BACK (TOUR DATES) */
                <div className="flex-1 w-full flex flex-col items-center justify-between py-6 px-4">
                  <div className="text-center">
                    <div className="text-xs font-mono font-black text-red-500 tracking-widest uppercase">
                      WORLDWIDE DECIMATION TOUR
                    </div>
                    <div className="text-[9px] font-mono text-zinc-400 tracking-wider">
                      {band.releaseYear} // ALL VENUES SUBJECT TO MOSH INJURY
                    </div>
                  </div>

                  <div className="space-y-2 w-full my-auto text-center font-mono">
                    {band.tourDates.map((tour, idx) => (
                      <div key={idx} className="text-[10px] text-zinc-300 border-b border-zinc-800/60 pb-1">
                        <span className="text-red-400 font-bold mr-2">{tour.date}</span>
                        <span className="text-white font-semibold">{tour.city}</span>
                        <span className="text-zinc-500 ml-1.5">@ {tour.venue}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center font-mono text-[9px] text-zinc-500">
                    {band.merchSlogan}
                  </div>
                </div>
              )}

              {/* Bottom hem tag */}
              <div className="w-full flex items-center justify-between text-[8px] font-mono text-zinc-600 pt-2 border-t border-zinc-900">
                <span>100% PRE-SHRUNK RINGSPUN</span>
                <span>AUTHENTIC TOUR MERCH</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs font-mono text-zinc-400 text-center">
            Merch Slogan: <span className="text-zinc-200">"{band.merchSlogan}"</span>
          </div>
        </div>

        {/* DISTRESSED TOUR POSTER / GIG FLYER */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-red-500" />
              <h4 className="text-lg font-bold font-mono text-white uppercase tracking-tight">
                Street Gig Flyer / Tour Poster
              </h4>
            </div>

            {/* Distressed wheatpaste flyer */}
            <div className="relative w-full aspect-[4/5] max-w-[380px] mx-auto bg-zinc-900 border-4 border-zinc-800 shadow-2xl p-5 flex flex-col justify-between overflow-hidden">
              {/* Halftone & xerox grain effect */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px] opacity-10 pointer-events-none" />

              {/* Ripped tape in corners */}
              <div className="absolute -top-3 -left-5 w-16 h-6 bg-amber-200/40 rotate-[-25deg] shadow pointer-events-none" />
              <div className="absolute -top-3 -right-5 w-16 h-6 bg-amber-200/40 rotate-[25deg] shadow pointer-events-none" />

              {/* Poster Header */}
              <div className="text-center border-b-2 border-red-600 pb-2">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold">
                  {band.label.toUpperCase()} PRESENTS
                </div>
                <div className="mt-1">
                  <BandLogo name={band.name} style={band.logoStyle} className="scale-90" />
                </div>
              </div>

              {/* Tour Dates List */}
              <div className="my-auto space-y-2.5 font-mono py-3">
                <div className="text-[9px] uppercase font-bold text-center tracking-widest text-red-400 mb-2">
                  -- LIVE PERFORMANCE DATES --
                </div>
                {band.tourDates.map((tour, idx) => (
                  <div key={idx} className="bg-black/40 border border-zinc-800 p-2 rounded text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-red-500">{tour.date}</span>
                      <span className="font-bold text-white uppercase">{tour.city}</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 mt-0.5">
                      Venue: {tour.venue}
                    </div>
                    {tour.supportingBands && tour.supportingBands.length > 0 && (
                      <div className="text-[9px] text-zinc-500 mt-0.5">
                        w/ {tour.supportingBands.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Poster Footer */}
              <div className="border-t-2 border-zinc-800 pt-2 text-center font-mono">
                <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                  DOORS 7:00 PM // MOSH AT YOUR OWN RISK
                </div>
                <div className="text-[8px] text-zinc-500 mt-0.5">
                  NO WEAPONS // NO PHONES IN THE PIT // CASH ONLY TICKETS AT DOOR
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs font-mono text-zinc-400 text-center">
            Booking & Label: <span className="text-zinc-200">{band.label}</span> ({band.hometown})
          </div>
        </div>
      </div>

      {/* SECTION 2: BAND LINEUP & GEAR RIGS */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-red-500" />
          <h4 className="text-lg font-bold font-mono text-white uppercase tracking-tight">
            Band Lineup & Heavy Rigs
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {band.members.map((member, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold block mb-1">
                  {member.role}
                </span>
                <h5 className="font-bold text-white text-sm mb-2">{member.name}</h5>
              </div>

              <div className="pt-3 border-t border-zinc-800/60">
                <span className="text-[10px] font-mono text-zinc-500 block mb-0.5">RIG & GEAR:</span>
                <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                  {member.gear}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <h5 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1 font-bold">
            Band Biography & Underground Lore:
          </h5>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {band.bio}
          </p>
        </div>
      </div>
    </div>
  );
};
