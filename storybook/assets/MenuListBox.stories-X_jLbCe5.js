import{c8 as s,bQ as e,c5 as h,w as g}from"./iframe-DXdR4xPj.js";import{F as M}from"./Flex-Cq1PC_VA.js";import{h as a,d as c,e as n}from"./Menu-BE7vb3R_.js";import{B}from"./BUIProvider-3mC0dqi4.js";import{T as j}from"./Text-BW0S3cTG.js";import{B as l}from"./Button-BCdMob26.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-C_htAJtr.js";import"./utils-C-HUDFAG.js";import"./useObjectRef-CbSdwcnt.js";import"./keyboard-DjhTbvoF.js";import"./useFocusRing-CYFxGxD_.js";import"./openLink-C1Sid2pZ.js";import"./useEvent-Cm9ScuUm.js";import"./useLabels-D61_ZlAV.js";import"./useLocalizedStringFormatter-CNTHe_n6.js";import"./I18nProvider-C2KDHo4-.js";import"./useControlledState-BREXAMRj.js";import"./Button-lJ2CGbxt.js";import"./Label-Zek0cQNR.js";import"./Hidden-DEL9fdLN.js";import"./useLabel-BKLzxkTR.js";import"./number-YjzVCZ5M.js";import"./useButton-BvDLj8oC.js";import"./usePress-CnZ4gSLR.js";import"./textSelection-BYJbH9-e.js";import"./useHover-DQCkeZXu.js";import"./getItemCount-Cz9MCKqo.js";import"./useCollection-3GpIKzwO.js";import"./FocusScope-BPEWfvie.js";import"./Input-BQrTLKPj.js";import"./ListBox-CEeIUydP.js";import"./Text-gNAEQAy_.js";import"./useListState-CoMNNvPQ.js";import"./Dialog-Ddg6xAXH.js";import"./Heading-Cd_XP2oj.js";import"./useOverlayTriggerState-9MfyzaMp.js";import"./VisuallyHidden-bnSaxykT.js";import"./animation-CfYGLk_Q.js";import"./SearchField-C-9_xXdO.js";import"./FieldError-BWSEqUjJ.js";import"./useFormValidation-5SPC4rhD.js";import"./useTextField-BzN2GkCH.js";import"./useField-RzY76_L5.js";import"./useFormReset-CLOf4j1R.js";import"./Virtualizer-ipgBCeUR.js";import"./useFilter-Cj_JbaCN.js";import"./index-DBKaRO06.js";import"./getNodeText-BvqNLFC8.js";import"./BUIRoutingProvider-Cv_U09wD.js";import"./useResolvedHref-CWLs1pfc.js";const d=h.meta({title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(g,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),o=d.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(n,{children:"Item 1"}),e.jsx(n,{children:"Item 2"}),e.jsx(n,{children:"Item 3"})]})]})}),m=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState(new Set(["paul"]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(j,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:i,children:[e.jsx(n,{id:"john",children:"John Lennon"},"item1"),e.jsx(n,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(n,{id:"george",children:"George Harrison"},"item3"),e.jsx(n,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),p=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}}),u=d.story({args:{...o.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(n,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
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
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </MenuListBoxItem>)}
        </MenuListBox>
      </MenuTrigger>;
  }
})`,...u.input.parameters?.docs?.source}}};const Me=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{m as Controlled,o as Default,p as Virtualized,u as VirtualizedMaxHeight,Me as __namedExportsOrder};
