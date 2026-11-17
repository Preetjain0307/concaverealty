# Helper functions to test category matching
def get_feature_meta(feat):
    f = feat.lower()
    if any(k in f for k in ['metro', 'railway', 'train', 'station', 'monorail']):
        return ('Transit & Metro', 'Train', 'from-emerald-50 to-teal-50', 'text-emerald-700', 'bg-emerald-600')
    elif any(k in f for k in ['mall', 'retail', 'inorbit', 'infiniti', 'shopping', 'phoenix', 'market']):
        return ('Retail & Lifestyle', 'ShoppingBag', 'from-amber-50 to-orange-50', 'text-amber-800', 'bg-[#C59B4E]')
    elif any(k in f for k in ['highway', 'express', 'weh', 'road', 'jvlr', 'sea link', 'coastal', 'freeway']):
        return ('Arterial Highway', 'Car', 'from-slate-50 to-stone-50', 'text-stone-800', 'bg-[#183C32]')
    elif any(k in f for k in ['park', 'forest', 'sea', 'beach', 'mountain', 'green', 'sanctuary', 'nature', 'promenade', 'racecourse']):
        return ('Scenic & Nature', 'Trees', 'from-green-50 to-emerald-50', 'text-emerald-800', 'bg-emerald-700')
    elif any(k in f for k in ['airport', 'bkc', 'sez', 'it park', 'commercial', 'corporate']):
        return ('Business Hub', 'Building2', 'from-blue-50 to-indigo-50', 'text-indigo-800', 'bg-indigo-700')
    else:
        return ('Key Advantage', 'Sparkles', 'from-amber-50 to-stone-50', 'text-[#8B6846]', 'bg-[#245348]')

test_feats = [
    "Direct Integrated Skywalk to Sky City Mall",
    "Directly Connected to Devipada Metro Station",
    "Zero-Minute Access to Western Express Highway",
    "Panoramic Unobstructed Views of Sanjay Gandhi National Park"
]
for tf in test_feats:
    print(tf, "->", get_feature_meta(tf))

