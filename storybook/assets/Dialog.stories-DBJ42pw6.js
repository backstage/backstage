import{bR as e,c7 as C}from"./iframe-DhttR-Z-.js";import{d as p,D as i,c as o,a as s,b as l}from"./Dialog-RrOc46n9.js";import{B as r}from"./Button-B-YMso9R.js";import{F as O}from"./Flex-D5DCCzct.js";import{T as F}from"./TextField-DQW3rIa_.js";import{S}from"./Select-C4s4Sb48.js";import{T as a}from"./Text-XAqvAdRp.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-B4ix50AT.js";import"./Button-DgJKv_H5.js";import"./utils-LkJ3JQqS.js";import"./useObjectRef-BfSKs3Th.js";import"./Label-uZej1Dod.js";import"./Hidden-BK8KEPOj.js";import"./useFocusRing-BMND1Xfk.js";import"./openLink-DDEWcvNy.js";import"./useLabel-DSVSe0FP.js";import"./useLabels-DbXANuou.js";import"./number-YKfsi7Zw.js";import"./I18nProvider-DS1fhYi3.js";import"./useButton-8cfX40X5.js";import"./usePress-D7UEUwIV.js";import"./textSelection-Gj6MkmHl.js";import"./useHover-DWM3_5-p.js";import"./Heading-CSGOVgUl.js";import"./useOverlayTriggerState-Cb5yY_lY.js";import"./useControlledState-CmzpYLdm.js";import"./useCollection-CmQEMhBS.js";import"./keyboard-BZWrF7pG.js";import"./FocusScope-B4sVtO-l.js";import"./useEvent-BqGsjR8x.js";import"./Autocomplete-du-Wb1TU.js";import"./useLocalizedStringFormatter-DPzPf3bZ.js";import"./getItemCount-WPYudUmT.js";import"./Text-OfXWTW-q.js";import"./VisuallyHidden-B4DWlS1H.js";import"./animation-BK6cA2RP.js";import"./index-51pH9e5U.js";import"./Input-BXU-L0c3.js";import"./TextField-e3OJ_HSR.js";import"./FieldError-DMbGr69Y.js";import"./useFormValidation-CWHGY4c7.js";import"./useTextField-D-rC3zog.js";import"./useField-CV1e6J1X.js";import"./useFormReset-Buno64eF.js";import"./FieldLabel-B1ltaPtV.js";import"./FieldError-Dl6Hm0lH.js";import"./ListBox-BBpHvFIQ.js";import"./useListState-DT_uuQg6.js";import"./SearchField-CLX91gFA.js";import"./useFilter-DipkhEIn.js";import"./useCollectionAdapter-D8otSXc1.js";import"./Avatar-CORnhkEq.js";import"./Skeleton-B3nGTZk7.js";import"./Popover-jsgv1o2Z.js";const{useArgs:H}=__STORYBOOK_MODULE_PREVIEW_API__,d=C.meta({title:"Backstage UI/Dialog",component:i,args:{isOpen:void 0,defaultOpen:void 0},argTypes:{isOpen:{control:"boolean"},defaultOpen:{control:"boolean"}}}),c=d.story({render:t=>e.jsxs(p,{children:[e.jsx(r,{variant:"secondary",children:"Open Dialog"}),e.jsxs(i,{...t,children:[e.jsx(o,{children:"Example Dialog"}),e.jsx(s,{children:e.jsx(a,{children:"This is a basic dialog example."})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(r,{variant:"primary",slot:"close",children:"Save"})]})]})]})}),g=c.extend({parameters:{layout:"fullscreen"},decorators:[t=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:e.jsx(t,{})})],args:{defaultOpen:!0}}),x=d.story({args:{isOpen:!0},render:t=>{const[{isOpen:b},m]=H();return e.jsxs(i,{...t,isOpen:b,onOpenChange:T=>m({isOpen:T}),children:[e.jsx(o,{children:"Example Dialog"}),e.jsx(s,{children:e.jsx(a,{children:"This is a basic dialog example."})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(r,{variant:"primary",slot:"close",children:"Save"})]})]})}}),n=d.story({args:{defaultOpen:!0,width:600},render:t=>e.jsxs(p,{children:[e.jsx(r,{variant:"secondary",children:"Open Dialog"}),e.jsxs(i,{...t,children:[e.jsx(o,{children:"Long Content Dialog"}),e.jsx(s,{children:e.jsxs(O,{direction:"column",gap:"3",children:[e.jsx(a,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(a,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(a,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."})]})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(r,{variant:"primary",slot:"close",children:"Accept"})]})]})]})}),h=n.extend({args:{defaultOpen:!0,width:void 0,height:500}}),D=n.extend({args:{height:400}}),v=n.extend({args:{defaultOpen:!0,width:"100%",height:"100%"}}),y=d.story({args:{isOpen:!0},render:t=>e.jsxs(p,{...t,children:[e.jsx(r,{variant:"secondary",children:"Delete Item"}),e.jsxs(i,{children:[e.jsx(o,{children:"Confirm Delete"}),e.jsx(s,{children:e.jsx(a,{children:"Are you sure you want to delete this item? This action cannot be undone."})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(r,{variant:"primary",slot:"close",children:"Delete"})]})]})]})}),u=d.story({args:{isOpen:!0},render:t=>e.jsxs(p,{...t,children:[e.jsx(r,{variant:"secondary",children:"Create User"}),e.jsxs(i,{children:[e.jsx(o,{children:"Create New User"}),e.jsx(s,{children:e.jsxs(O,{direction:"column",gap:"3",children:[e.jsx(F,{label:"Name",placeholder:"Enter full name"}),e.jsx(F,{label:"Email",placeholder:"Enter email address"}),e.jsx(S,{label:"Role",options:[{value:"admin",label:"Admin"},{value:"user",label:"User"},{value:"viewer",label:"Viewer"}]})]})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(r,{variant:"primary",slot:"close",children:"Create User"})]})]})]})}),j=d.story({args:{defaultOpen:!0},render:t=>e.jsxs(p,{children:[e.jsx(r,{variant:"secondary",children:"Open Dialog"}),e.jsxs(i,{...t,children:[e.jsx(o,{children:"Overflow Without Height"}),e.jsx(s,{children:e.jsx(O,{direction:"column",gap:"3",children:Array.from({length:20},(b,m)=>e.jsxs(a,{children:["Line ",m+1,": Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]},m))})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(r,{variant:"primary",slot:"close",children:"Confirm"})]})]})]})}),f=n.extend({args:{defaultOpen:void 0,width:600,height:400}}),B=u.extend({args:{isOpen:void 0}});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    return <DialogTrigger>
        <Button variant="secondary">Open Dialog</Button>
        <Dialog {...args}>
          <DialogHeader>Example Dialog</DialogHeader>
          <DialogBody>
            <Text>This is a basic dialog example.</Text>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" slot="close">
              Close
            </Button>
            <Button variant="primary" slot="close">
              Save
            </Button>
          </DialogFooter>
        </Dialog>
      </DialogTrigger>;
  }
})`,...c.input.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`Default.extend({
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [Story => <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)',
    backgroundSize: '16px 16px'
  }}>
        <Story />
      </div>],
  args: {
    defaultOpen: true
  }
})`,...g.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    isOpen: true
  },
  render: args => {
    const [{
      isOpen
    }, updateArgs] = useArgs();
    return <Dialog {...args} isOpen={isOpen} onOpenChange={value => updateArgs({
      isOpen: value
    })}>
        <DialogHeader>Example Dialog</DialogHeader>
        <DialogBody>
          <Text>This is a basic dialog example.</Text>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" slot="close">
            Close
          </Button>
          <Button variant="primary" slot="close">
            Save
          </Button>
        </DialogFooter>
      </Dialog>;
  }
})`,...x.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    defaultOpen: true,
    width: 600
  },
  render: args => <DialogTrigger>
      <Button variant="secondary">Open Dialog</Button>
      <Dialog {...args}>
        <DialogHeader>Long Content Dialog</DialogHeader>
        <DialogBody>
          <Flex direction="column" gap="3">
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
            <Text>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </Text>
            <Text>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </Text>
          </Flex>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" slot="close">
            Cancel
          </Button>
          <Button variant="primary" slot="close">
            Accept
          </Button>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
})`,...n.input.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    defaultOpen: true,
    width: undefined,
    height: 500
  }
})`,...h.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    height: 400
  }
})`,...D.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    defaultOpen: true,
    width: '100%',
    height: '100%'
  }
})`,...v.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    isOpen: true
  },
  render: args => <DialogTrigger {...args}>
      <Button variant="secondary">Delete Item</Button>
      <Dialog>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          <Text>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </Text>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" slot="close">
            Cancel
          </Button>
          <Button variant="primary" slot="close">
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
})`,...y.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    isOpen: true
  },
  render: args => <DialogTrigger {...args}>
      <Button variant="secondary">Create User</Button>
      <Dialog>
        <DialogHeader>Create New User</DialogHeader>
        <DialogBody>
          <Flex direction="column" gap="3">
            <TextField label="Name" placeholder="Enter full name" />
            <TextField label="Email" placeholder="Enter email address" />
            <Select label="Role" options={[{
            value: 'admin',
            label: 'Admin'
          }, {
            value: 'user',
            label: 'User'
          }, {
            value: 'viewer',
            label: 'Viewer'
          }]} />
          </Flex>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" slot="close">
            Cancel
          </Button>
          <Button variant="primary" slot="close">
            Create User
          </Button>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
})`,...u.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    defaultOpen: true
  },
  render: args => <DialogTrigger>
      <Button variant="secondary">Open Dialog</Button>
      <Dialog {...args}>
        <DialogHeader>Overflow Without Height</DialogHeader>
        <DialogBody>
          <Flex direction="column" gap="3">
            {Array.from({
            length: 20
          }, (_, i) => <Text key={i}>
                Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </Text>)}
          </Flex>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" slot="close">
            Cancel
          </Button>
          <Button variant="primary" slot="close">
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
})`,...j.input.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    defaultOpen: undefined,
    width: 600,
    height: 400
  }
})`,...f.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`WithForm.extend({
  args: {
    isOpen: undefined
  }
})`,...B.parameters?.docs?.source}}};const We=["Default","Open","NoTrigger","FixedWidth","FixedHeight","FixedWidthAndHeight","FullWidthAndHeight","Confirmation","WithForm","OverflowWithoutHeight","PreviewFixedWidthAndHeight","PreviewWithForm"];export{y as Confirmation,c as Default,h as FixedHeight,n as FixedWidth,D as FixedWidthAndHeight,v as FullWidthAndHeight,x as NoTrigger,g as Open,j as OverflowWithoutHeight,f as PreviewFixedWidthAndHeight,B as PreviewWithForm,u as WithForm,We as __namedExportsOrder};
