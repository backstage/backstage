import{r as s,j as e,p as g,M as h}from"./iframe-CwGYDpYH.js";import{F as M}from"./Flex-R-8FKq6O.js";import{a,h as c,g as n}from"./Menu-CRc7dZX3.js";import{B}from"./BUIProvider-BSpClcjO.js";import{T as j}from"./Text-DK_d1bQc.js";import{B as l}from"./Button-CxmKpBhb.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-BrgDjI-e.js";import"./utils-Cp-Yx8Dx.js";import"./useObjectRef-BLdCmDNN.js";import"./keyboard-DLLhyonf.js";import"./useFocusRing-CsY8JheF.js";import"./openLink-Ds4I99G_.js";import"./useEvent-DYwbjjw0.js";import"./useLabels-CfNqgJqs.js";import"./useLocalizedStringFormatter-DMuSLF1w.js";import"./I18nProvider-SX5Amjdy.js";import"./useControlledState-Cn52zD0h.js";import"./Button-CkSLB3SJ.js";import"./Label-VngP_PCJ.js";import"./Hidden-BIN5-_pJ.js";import"./useLabel-4uvRVmKe.js";import"./number-DJ_eZXJu.js";import"./useButton-CtJsoNcc.js";import"./usePress-Cc77xHsf.js";import"./textSelection-CA216veY.js";import"./useHover-Be8TzpC8.js";import"./getItemCount-Cv933Zvt.js";import"./useCollection-czdlv3MZ.js";import"./FocusScope-D4SOuGAC.js";import"./Input-o-KIrBdv.js";import"./ListBox-D90wieCt.js";import"./Text-DBUj1pnT.js";import"./useListState-D2aLMd28.js";import"./Dialog-EbXxqGt2.js";import"./Heading-Ba3Z72mw.js";import"./useOverlayTriggerState-C3EIV5Ta.js";import"./VisuallyHidden-D5M4n7HU.js";import"./animation-T6HHZen5.js";import"./SearchField-DSgymj46.js";import"./FieldError-CECOOI2C.js";import"./useFormValidation-DBKMYoZ7.js";import"./useTextField-DoWt_bQy.js";import"./useField-QJgOwdZz.js";import"./useFormReset-DmlFrmJI.js";import"./Virtualizer-CGR8TKzD.js";import"./useFilter-BqVi6c7Y.js";import"./index-zV1ySdbQ.js";import"./getNodeText-DtuybN0A.js";import"./useResolvedHref-ByF3i79N.js";const d=g.meta({title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(h,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),o=d.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(n,{children:"Item 1"}),e.jsx(n,{children:"Item 2"}),e.jsx(n,{children:"Item 3"})]})]})}),m=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState(new Set(["paul"]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(j,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:i,children:[e.jsx(n,{id:"john",children:"John Lennon"},"item1"),e.jsx(n,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(n,{id:"george",children:"George Harrison"},"item3"),e.jsx(n,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),p=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},x))})]})}}),u=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},x))})]})}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: null
  },
  render: () => <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuListBox>
        <MenuListBoxItem>Item 1</MenuListBoxItem>
        <MenuListBoxItem>Item 2</MenuListBoxItem>
        <MenuListBoxItem>Item 3</MenuListBoxItem>
      </MenuListBox>
    </MenuTrigger>
})`,...o.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set(['paul']));
    return <Flex direction="column" gap="2" align="start">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <MenuListBox selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
            <MenuListBoxItem key="item1" id="john">
              John Lennon
            </MenuListBoxItem>
            <MenuListBoxItem key="item2" id="paul">
              Paul McCartney
            </MenuListBoxItem>
            <MenuListBoxItem key="item3" id="george">
              George Harrison
            </MenuListBoxItem>
            <MenuListBoxItem key="item4" id="ringo">
              Ringo Starr
            </MenuListBoxItem>
          </MenuListBox>
        </MenuTrigger>
      </Flex>;
  }
})`,...m.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => {
    const [pokemon, setPokemon] = useState<Array<{
      name: string;
      url: string;
    }>>([]);
    useEffect(() => {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1000').then(response => response.json()).then(data => {
        setPokemon(data.results);
      }).catch(error => {
        console.error('Error fetching Pokemon:', error);
      });
    }, []);
    return <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <MenuListBox items={pokemon} virtualized>
          {pokemon.map((p, index) => <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuListBox>
      </MenuTrigger>;
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: () => {
    const [pokemon, setPokemon] = useState<Array<{
      name: string;
      url: string;
    }>>([]);
    useEffect(() => {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1000').then(response => response.json()).then(data => {
        setPokemon(data.results);
      }).catch(error => {
        console.error('Error fetching Pokemon:', error);
      });
    }, []);
    return <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <MenuListBox items={pokemon} virtualized maxHeight="300px">
          {pokemon.map((p, index) => <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuListBox>
      </MenuTrigger>;
  }
})`,...u.input.parameters?.docs?.source}}};const he=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{m as Controlled,o as Default,p as Virtualized,u as VirtualizedMaxHeight,he as __namedExportsOrder};
