import{j as e,r as s}from"./iframe-C773ayyW.js";import{M as a,h as p,g as o}from"./Menu-YZjvnbj2.js";import{M as x}from"./index-B7-NdQX-.js";import{B as l}from"./Button-DRbTfoz_.js";import{F as g}from"./Flex-C1nDuq_M.js";import{T as h}from"./Text-BO1X0c4-.js";import"./preload-helper-D9Z9MdNV.js";import"./Dialog-BJe1cx3g.js";import"./ListBox-uUIuZfEZ.js";import"./useListState-CCM38PET.js";import"./useFocusable-BBaTtD3O.js";import"./useObjectRef-NT8Wd318.js";import"./clsx-B-dksMZM.js";import"./usePress-D_atXe_J.js";import"./useEvent-BCYFdJsu.js";import"./SelectionIndicator-DfJVQXPE.js";import"./context-ta26vvxU.js";import"./Hidden-DlfeZ9CP.js";import"./useControlledState-NNyTOsU8.js";import"./utils-Cv7Kn9dL.js";import"./RSPContexts-DuQSzXBC.js";import"./Text-CIKbWX9Y.js";import"./useLabel-DG3PhcjR.js";import"./useLabels-C_0OhMzU.js";import"./useFocusRing-CQn_nDjY.js";import"./useLocalizedStringFormatter-56LRyP6A.js";import"./Button-CA36c2VJ.js";import"./Label-BS-uMQj_.js";import"./OverlayArrow-CfUpVGfq.js";import"./VisuallyHidden-D8fC2Dsb.js";import"./Input-hPiD-ud0.js";import"./useFormReset-Cdkt3Tvt.js";import"./Form-CZXjlOgu.js";import"./SearchField-DVJOw_Uf.js";import"./FieldError-B3jv2gHJ.js";import"./useStyles-C_I6PZaw.js";import"./index-wL_qdj4M.js";import"./isExternalLink-DzQTpl4p.js";import"./Button.module-BPzqtDAO.js";const re={title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(x,{children:e.jsx(r,{})})]},n={args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(p,{children:[e.jsx(o,{children:"Item 1"}),e.jsx(o,{children:"Item 2"}),e.jsx(o,{children:"Item 3"})]})]})},m={args:{...n.args},render:()=>{const[r,i]=s.useState(new Set(["paul"]));return e.jsxs(g,{direction:"column",gap:"2",align:"start",children:[e.jsxs(h,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(p,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:i,children:[e.jsx(o,{id:"john",children:"John Lennon"},"item1"),e.jsx(o,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(o,{id:"george",children:"George Harrison"},"item3"),e.jsx(o,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}},u={args:{...n.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(p,{items:r,virtualized:!0,children:r.map((t,d)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},d))})]})}},c={args:{...n.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(p,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,d)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},d))})]})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
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
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
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
}`,...u.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
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
}`,...c.parameters?.docs?.source}}};const oe=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{m as Controlled,n as Default,u as Virtualized,c as VirtualizedMaxHeight,oe as __namedExportsOrder,re as default};
