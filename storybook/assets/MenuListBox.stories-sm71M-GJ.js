import{r as s,j as e,p as g,M as h}from"./iframe-CSz7VfT3.js";import{F as M}from"./Flex-BGh7AQqa.js";import{a,h as c,g as o}from"./Menu-_rPBvSnO.js";import{B}from"./BUIProvider-DlsqQjlV.js";import{T as j}from"./Text-Cq25VfyC.js";import{B as l}from"./Button-DWUG8GjN.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-__qsaNuQ.js";import"./utils-DO510V5r.js";import"./useObjectRef-D_q6rl-C.js";import"./keyboard-Bg9gEdpU.js";import"./useFocusRing-Fbq9rG4I.js";import"./openLink-BZZjesw9.js";import"./getMetaValue-C_A1bvat.js";import"./useEvent-B1v68yyd.js";import"./useLabels-53H5tn1J.js";import"./useLocalizedStringFormatter-C142jinZ.js";import"./I18nProvider-C8LosUml.js";import"./useControlledState-D9BG_cB_.js";import"./Button-Be0Cy88V.js";import"./Label-AZq59z2_.js";import"./Hidden-CM7FbOlL.js";import"./useLabel-B7GfVGDS.js";import"./number-vPK-eftY.js";import"./useButton-0UwCDxtn.js";import"./usePress-BkOB3jXf.js";import"./textSelection-xDV9V9Np.js";import"./useHover-C4tPk2eu.js";import"./useLoadMoreSentinel-D4Tl_mKJ.js";import"./useCollection-BRMINt-w.js";import"./FocusScope-q3DFSEE5.js";import"./Input-rX87b3KQ.js";import"./ListBox-zKNf2tM4.js";import"./SelectionIndicator-D0yCXn87.js";import"./Text-M5JE05Z1.js";import"./useListState-Bb8eRarH.js";import"./Dialog-rSqyM-23.js";import"./Heading-tcCPkFfK.js";import"./useOverlayTriggerState-BU4FYN95.js";import"./VisuallyHidden-BSkWTXCt.js";import"./animation-CNMihT0b.js";import"./SearchField-B0js2RMr.js";import"./FieldError-D30XUBdE.js";import"./Form-DCmzyXZg.js";import"./useFormValidation-BaS-Dz0q.js";import"./useTextField-B5NRQ6t7.js";import"./useField-CqcWBy83.js";import"./useFormReset-9iV2nQ5O.js";import"./Virtualizer-CnlLdrFa.js";import"./useFilter-CmszS9mf.js";import"./index-ndNk04vF.js";import"./getNodeText-B5fQbWGz.js";import"./BUIRoutingProvider-DWliD39c.js";import"./useResolvedHref-Dnk2mOGG.js";const d=g.meta({title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(h,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),n=d.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(o,{children:"Item 1"}),e.jsx(o,{children:"Item 2"}),e.jsx(o,{children:"Item 3"})]})]})}),m=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState(new Set(["paul"]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(j,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:i,children:[e.jsx(o,{id:"john",children:"John Lennon"},"item1"),e.jsx(o,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(o,{id:"george",children:"George Harrison"},"item3"),e.jsx(o,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),p=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}}),u=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};const ke=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{m as Controlled,n as Default,p as Virtualized,u as VirtualizedMaxHeight,ke as __namedExportsOrder};
