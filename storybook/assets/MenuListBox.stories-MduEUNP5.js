import{p as M,j as e,r as m}from"./iframe-BWaAozhM.js";import{M as p,h as c,g as o}from"./Menu-BOyHn27m.js";import{M as g}from"./index-Dm-FVvkq.js";import{B as l}from"./Button-BMkL7aeI.js";import{F as h}from"./Flex-CEP-a6W4.js";import{T as B}from"./Text-bsWBEc7g.js";import"./preload-helper-PPVm8Dsz.js";import"./Autocomplete-DOxCY-Jm.js";import"./Separator-omcvpb7d.js";import"./SelectionManager-vmk1jiqY.js";import"./useFocusable-aoDfsFoT.js";import"./useObjectRef-BTDgeL77.js";import"./clsx-B-dksMZM.js";import"./useEvent-CSA8ij6d.js";import"./SelectionIndicator-BBzKKyhK.js";import"./context-DFCqDYLa.js";import"./usePress-B5_26UyD.js";import"./Hidden-BLPYDIAR.js";import"./useControlledState-XBbF84YX.js";import"./utils-WXrXC9j-.js";import"./RSPContexts-Cg4jVke0.js";import"./useLabels-BQ4FYR3q.js";import"./useLocalizedStringFormatter-Dd8suctx.js";import"./Button-DHD-AfPm.js";import"./Label-DsrPSBuj.js";import"./useLabel-CE9deeWm.js";import"./useButton-DlTrrITM.js";import"./useFocusRing--9XdYmhb.js";import"./Input-Dd_WSUbQ.js";import"./useFormReset-Byg6qJ_j.js";import"./useField-DQgpoXJ5.js";import"./Form-BDk2mmb3.js";import"./ListBox-CMRVcK-q.js";import"./Text-BvMWx7XH.js";import"./useListState-Ca4oyG9C.js";import"./Dialog-CzENLXPw.js";import"./OverlayArrow-CEkIqqeZ.js";import"./animation-Cnc2ApK0.js";import"./VisuallyHidden-DP2arGQY.js";import"./SearchField-LTK3HAep.js";import"./FieldError-B_hLCRbz.js";import"./useStyles-CwzUWqcD.js";import"./index-B_bSItch.js";import"./InternalLinkProvider-D7rahURl.js";import"./defineComponent-DEnlIDuV.js";import"./useBg-DfFnva_Z.js";const d=M.meta({title:"Backstage UI/MenuListBox",component:p,decorators:[r=>e.jsx(g,{children:e.jsx(r,{})})]}),n=d.story({args:{children:null},render:()=>e.jsxs(p,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{children:[e.jsx(o,{children:"Item 1"}),e.jsx(o,{children:"Item 2"}),e.jsx(o,{children:"Item 3"})]})]})}),i=d.story({args:{...n.input.args},render:()=>{const[r,u]=m.useState(new Set(["paul"]));return e.jsxs(h,{direction:"column",gap:"2",align:"start",children:[e.jsxs(B,{children:["Selected: ",Array.from(r).join(", ")]}),e.jsxs(p,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsxs(c,{selectionMode:"multiple",selectedKeys:r,onSelectionChange:u,children:[e.jsx(o,{id:"john",children:"John Lennon"},"item1"),e.jsx(o,{id:"paul",children:"Paul McCartney"},"item2"),e.jsx(o,{id:"george",children:"George Harrison"},"item3"),e.jsx(o,{id:"ringo",children:"Ringo Starr"},"item4")]})]})]})}}),s=d.story({args:{...n.input.args},render:()=>{const[r,u]=m.useState([]);return m.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{u(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(p,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},x))})]})}}),a=d.story({args:{...n.input.args},render:()=>{const[r,u]=m.useState([]);return m.useEffect(()=>{fetch("https://pokeapi.co/api/v2/pokemon?limit=1000").then(t=>t.json()).then(t=>{u(t.results)}).catch(t=>{console.error("Error fetching Pokemon:",t)})},[]),e.jsxs(p,{isOpen:!0,children:[e.jsx(l,{"aria-label":"Menu",children:"Menu"}),e.jsx(c,{items:r,virtualized:!0,maxHeight:"300px",children:r.map((t,x)=>e.jsx(o,{id:t.name,children:t.name.charAt(0).toLocaleUpperCase("en-US")+t.name.slice(1)},x))})]})}});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const Default = () => (
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
