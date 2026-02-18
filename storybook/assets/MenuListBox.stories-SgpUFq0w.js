import{p as M,j as e,r as m}from"./iframe-BCnUaApn.js";import{M as p,h as c,g as o}from"./Menu-CirqowDw.js";import{M as g}from"./index-B-tXUl4g.js";import{B as l}from"./Button-D1UtiXm9.js";import{F as h}from"./Flex-C4_VXeUv.js";import{T as B}from"./Text-7DzLtOao.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-C5aCutPN.js";import"./Separator-CI8voDCH.js";import"./SelectionManager-ff8dn8e6.js";import"./useFocusable-IBdaFBnD.js";import"./useObjectRef-BR0woDLl.js";import"./clsx-B-dksMZM.js";import"./useEvent-_JMIMpMq.js";import"./SelectionIndicator-CzQe8hsl.js";import"./context-BTFoXqpl.js";import"./usePress-CH3IhpRl.js";import"./Hidden-res7_ry-.js";import"./useControlledState-D-0AnbRi.js";import"./utils-RvjmVahY.js";import"./RSPContexts-BztQoVKM.js";import"./useLabels-BMbv52st.js";import"./useLocalizedStringFormatter-DA-vuD6j.js";import"./Button-QGbbW5HI.js";import"./Label-77M3QVcR.js";import"./useLabel-osR5ePXA.js";import"./useButton-CDPkDdYd.js";import"./useFocusRing-BOpkZtUv.js";import"./Input-D8bapnLm.js";import"./useFormReset-BAPz-9gR.js";import"./useField-DED5x7mA.js";import"./Form-B5hyZtpR.js";import"./ListBox-D6wdQSc7.js";import"./Text-BD4pqHvr.js";import"./useListState-CWLkodGh.js";import"./Dialog-Dtf5cdjD.js";import"./OverlayArrow-CTgIq-mA.js";import"./animation-CRlX_v_Q.js";import"./VisuallyHidden-BHzDl_kA.js";import"./SearchField-B41wW94L.js";import"./FieldError-DjdmRnUg.js";import"./useStyles-C_N034HV.js";import"./index-Cizx8GJy.js";import"./InternalLinkProvider-hZrGwUhP.js";import"./defineComponent-DM3UJ0KB.js";import"./useBg-CcTCGP9g.js";const d=M.meta({title:"Backstage UI/MenuListBox",component:p,decorators:[r=>e.jsx(g,{children:e.jsx(r,{})})]}),n=d.story({args:{children:null},render:()=>e.jsxs(p,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(o,{children:"Item 1"}),e.jsx(o,{children:"Item 2"}),e.jsx(o,{children:"Item 3"})]})]})}),i=d.story({args:{...n.input.args},render:()=>{const[r,u]=m.useState(new Set(["paul"]));return e.jsxs(h,{direction:"column",gap:"2",align:"start",children:[e.jsxs(B,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(p,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:u,children:[e.jsx(o,{id:"john",children:"John Lennon"},"item1"),e.jsx(o,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(o,{id:"george",children:"George Harrison"},"item3"),e.jsx(o,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),s=d.story({args:{...n.input.args},render:()=>{const[r,u]=m.useState([]);return m.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{u(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(p,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},x))})]})}}),a=d.story({args:{...n.input.args},render:()=>{const[r,u]=m.useState([]);return m.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{u(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(p,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},x))})]})}});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const Default = () => (
  <MenuTrigger isOpen>
    <Button aria-label="Menu">Menu</Button>
    <MenuListBox>
      <MenuListBoxItem>Item 1</MenuListBoxItem>
      <MenuListBoxItem>Item 2</MenuListBoxItem>
      <MenuListBoxItem>Item 3</MenuListBoxItem>
    </MenuListBox>
  </MenuTrigger>
);
`,...n.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const Controlled = () => {
  const [selected, setSelected] = useState<Selection>(new Set(["paul"]));

  return (
    <Flex direction="column" gap="2" align="start">
      <Text>Selected: {Array.from(selected).join(", ")}</Text>
      <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <MenuListBox
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
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
    </Flex>
  );
};
`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Virtualized = () => {
  const [pokemon, setPokemon] = useState<Array<{ name: string; url: string }>>(
    []
  );

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data.results);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon:", error);
      });
  }, []);

  return (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuListBox items={pokemon} virtualized>
        {pokemon.map((p, index) => (
          <MenuListBoxItem key={index} id={p.name}>
            {p.name.charAt(0).toLocaleUpperCase("en-US") + p.name.slice(1)}
          </MenuListBoxItem>
        ))}
      </MenuListBox>
    </MenuTrigger>
  );
};
`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const VirtualizedMaxHeight = () => {
  const [pokemon, setPokemon] = useState<Array<{ name: string; url: string }>>(
    []
  );

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data.results);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon:", error);
      });
  }, []);

  return (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuListBox items={pokemon} virtualized maxHeight="300px">
        {pokemon.map((p, index) => (
          <MenuListBoxItem key={index} id={p.name}>
            {p.name.charAt(0).toLocaleUpperCase("en-US") + p.name.slice(1)}
          </MenuListBoxItem>
        ))}
      </MenuListBox>
    </MenuTrigger>
  );
};
`,...a.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const ce=["Default","Controlled","Virtualized","VirtualizedMaxHeight"];export{i as Controlled,n as Default,s as Virtualized,a as VirtualizedMaxHeight,ce as __namedExportsOrder};
