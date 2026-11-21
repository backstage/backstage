import{r as s,j as e,p as g}from"./iframe-81VbGqYS.js";import{T as h}from"./TestRouter-mD7dv3Pk.js";import{F as M}from"./Flex-Dv4Mz7Ju.js";import{a,h as c,g as o}from"./Menu-Bi3KmNIt.js";import{B}from"./BUIProvider-E8WhSxx6.js";import{T as j}from"./Text-YsoifKm_.js";import{B as l}from"./Button-VhUoAoo2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BTbib15M.js";import"./Autocomplete-DwtsJgQQ.js";import"./utils-Bc3qSy6a.js";import"./useObjectRef-CnOD3daG.js";import"./keyboard-CCO2TRC1.js";import"./useFocusRing-DYHYlv_4.js";import"./getMetaValue-CCa-nVAs.js";import"./useEvent-BH0muyj4.js";import"./useLabels-DvwPDbuz.js";import"./useLocalizedStringFormatter-CCFWdnVn.js";import"./I18nProvider-DxzKOluv.js";import"./useControlledState-DitDneEU.js";import"./Button-C-RbpSFH.js";import"./Label-Dd3OarLH.js";import"./Hidden-Cb1mFWSL.js";import"./useLabel-DNA1h8U7.js";import"./number-CXfm_f_X.js";import"./useButton-D4MYDvTL.js";import"./usePress-Ck2OcU07.js";import"./textSelection-Dc2ic2y7.js";import"./useHover-BliW0Nnt.js";import"./useLoadMoreSentinel-BHThIPjI.js";import"./useCollection-CQ5WrmA1.js";import"./FocusScope-DDyHpiBa.js";import"./Input-D4Umh9QE.js";import"./ListBox-C20e-ujn.js";import"./SelectionIndicator-BKJhibyF.js";import"./Text-Dwv53_8C.js";import"./useListState-CNgw0_PC.js";import"./Dialog-YrzWagd5.js";import"./Heading-CoXsiMEk.js";import"./useOverlayTriggerState-CQqx4yUK.js";import"./VisuallyHidden-DRGpg-Tu.js";import"./animation-DeGzi18H.js";import"./SearchField-ESIovKsa.js";import"./FieldError-ptcf45Tc.js";import"./Form-BW2R70vK.js";import"./useFormValidation-iCx97y-U.js";import"./useTextField-B6wfEo-c.js";import"./useField-C1N2YRai.js";import"./useFormReset-BBjLEm68.js";import"./Virtualizer-CTr4aw9n.js";import"./useFilter-B2Yw2vQL.js";import"./index-CoR4Ep33.js";import"./getNodeText-_cKwjCAI.js";import"./BUIRoutingProvider-DmskIIHn.js";const d=g.meta({title:"Backstage UI/MenuListBox",component:a,decorators:[r=>e.jsx(h,{children:e.jsx(B,{children:e.jsx(r,{})})})]}),n=d.story({args:{children:null},render:()=>e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(o,{children:"Item 1"}),e.jsx(o,{children:"Item 2"}),e.jsx(o,{children:"Item 3"})]})]})}),m=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState(new Set(["paul"]));return e.jsxs(M,{direction:"column",gap:"2",align:"start",children:[e.jsxs(j,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:i,children:[e.jsx(o,{id:"john",children:"John Lennon"},"item1"),e.jsx(o,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(o,{id:"george",children:"George Harrison"},"item3"),e.jsx(o,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),p=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}}),u=d.story({args:{...n.input.args},render:()=>{const[r,i]=s.useState([]);return s.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{i(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(a,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toUpperCase()+t.name.slice(1)},x))})]})}});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
