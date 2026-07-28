import{ca as s,bR as e,c7 as h,w as g}from"./iframe-DQtIir6_.js";import{F as M}from"./Flex-NAN1tDLO.js";import{h as a,d as c,e as n}from"./Menu-DgwMA5HY.js";import{B}from"./BUIProvider-BFppeoJz.js";import{T as j}from"./Text-B6ISVKHE.js";import{B as l}from"./Button-nmMQ5_9b.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-CbdvlYso.js";import"./utils-Bxehr4HY.js";import"./useObjectRef-DXWxL9lA.js";import"./keyboard-CcRtsJxd.js";import"./useFocusRing-C5ZfLx-L.js";import"./openLink-DLb8P_7j.js";import"./useEvent-CfByOP8u.js";import"./useLabels-DLIlGtBk.js";import"./useLocalizedStringFormatter-DGn_4eCR.js";import"./I18nProvider-DPDmyrTN.js";import"./useControlledState-DM-B3g3-.js";import"./Button-hU1qrjNo.js";import"./Label-CAcSZgVu.js";import"./Hidden-BXNE10bz.js";import"./useLabel-mAp9Q6tE.js";import"./number-CQw8CDov.js";import"./useButton-yvh0BHKl.js";import"./usePress-T3jvNl8O.js";import"./textSelection-Nrcy7rMY.js";import"./useHover-Dsk-KXl4.js";import"./getItemCount-CVX00gh7.js";import"./useCollection-DgHWP1O0.js";import"./FocusScope-BBiWJUPZ.js";import"./Input-DhaMJBF2.js";import"./ListBox-CL87kPUx.js";import"./Text-C6rkAhiv.js";import"./useListState-BnLB_jOB.js";import"./Dialog-7WeMafGQ.js";import"./Heading-BHHcqdTe.js";import"./useOverlayTriggerState-BR5G58Ql.js";import"./VisuallyHidden-CmFx4Hen.js";import"./animation-BlVyC_Be.js";import"./SearchField-BYdwdggT.js";import"./FieldError-X1ho85_q.js";import"./useFormValidation-CcujdjyJ.js";import"./useTextField-fgQA1ZSg.js";import"./useField-X2MxXqm2.js";import"./useFormReset-BmTewx61.js";import"./Virtualizer-jJxeYzGB.js";import"./useFilter-CKsTtfCn.js";import"./index-DAbm8TV7.js";import"./getNodeText-lXATV8-K.js";import"./useResolvedHref-DS33idVI.js";const d=h.meta({title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(g,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),o=d.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(n,{children:"Item 1"}),e.jsx(n,{children:"Item 2"}),e.jsx(n,{children:"Item 3"})]})]})}),m=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState(new Set(["paul"]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(j,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:i,children:[e.jsx(n,{id:"john",children:"John Lennon"},"item1"),e.jsx(n,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(n,{id:"george",children:"George Harrison"},"item3"),e.jsx(n,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),p=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},x))})]})}}),u=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},x))})]})}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};const ge=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{m as Controlled,o as Default,p as Virtualized,u as VirtualizedMaxHeight,ge as __namedExportsOrder};
