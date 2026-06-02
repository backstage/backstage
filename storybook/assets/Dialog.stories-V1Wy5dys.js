import{bR as e,c7 as C}from"./iframe-DogXi1kP.js";import{d as p,D as i,c as o,a as s,b as l}from"./Dialog-BlGnagQE.js";import{B as r}from"./Button-DOk-0Wn9.js";import{F as O}from"./Flex-Bi-SKTgz.js";import{T as F}from"./TextField-B2AexvOc.js";import{S}from"./Select-mDMlc7hP.js";import{T as a}from"./Text-BbRcKCRf.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-CuUASSK4.js";import"./Button-Fh9tm360.js";import"./utils-AxfqVSE9.js";import"./useObjectRef-UHrM_yCs.js";import"./Label-BT3yvL3F.js";import"./Hidden-CYdnfqbh.js";import"./useFocusRing-mENG_ikp.js";import"./openLink-CxuZpafj.js";import"./useLabel-DvnqIlMC.js";import"./useLabels-DnC-SBWU.js";import"./number-C2ZI7feN.js";import"./I18nProvider-Cag9fozJ.js";import"./useButton-C2CjCUzA.js";import"./usePress-PepYZ5yJ.js";import"./textSelection-QdGxsqrV.js";import"./useHover-ox9S2Piy.js";import"./Heading-CeGRyyrD.js";import"./useOverlayTriggerState-NZ_YQKiz.js";import"./useControlledState-CrzRLYRc.js";import"./useCollection-D7sNZtry.js";import"./keyboard-a1n3wmz-.js";import"./FocusScope-C_GT869N.js";import"./useEvent-EwjaUY4k.js";import"./Autocomplete-DYW-F-Tj.js";import"./useLocalizedStringFormatter-CfgpiWB3.js";import"./getItemCount-C0QHxlzQ.js";import"./Text-BRIb-OAb.js";import"./VisuallyHidden-BwKEPC3N.js";import"./animation-NVFnR0bW.js";import"./index-RV6Ph9vd.js";import"./Input-BStAHKnh.js";import"./TextField-PaVvYibd.js";import"./FieldError-CzpSx-Mx.js";import"./useFormValidation-BIYlJHZ1.js";import"./useTextField-D7_hM5Yb.js";import"./useField-DTPdncVL.js";import"./useFormReset-CXIeSoiQ.js";import"./FieldLabel-DFPXv5Zo.js";import"./FieldError-VyUtu5uM.js";import"./ListBox-CpFc4rcf.js";import"./useListState-Y13CpHKJ.js";import"./definition-Bl2138zY.js";import"./SearchField-bPygfAon.js";import"./useFilter-CBfUSc_L.js";const{useArgs:H}=__STORYBOOK_MODULE_PREVIEW_API__,d=C.meta({title:"Backstage UI/Dialog",component:i,args:{isOpen:void 0,defaultOpen:void 0},argTypes:{isOpen:{control:"boolean"},defaultOpen:{control:"boolean"}}}),c=d.story({render:t=>e.jsxs(p,{children:[e.jsx(r,{variant:"secondary",children:"Open Dialog"}),e.jsxs(i,{...t,children:[e.jsx(o,{children:"Example Dialog"}),e.jsx(s,{children:e.jsx(a,{children:"This is a basic dialog example."})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(r,{variant:"primary",slot:"close",children:"Save"})]})]})]})}),g=c.extend({parameters:{layout:"fullscreen"},decorators:[t=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:e.jsx(t,{})})],args:{defaultOpen:!0}}),x=d.story({args:{isOpen:!0},render:t=>{const[{isOpen:b},m]=H();return e.jsxs(i,{...t,isOpen:b,onOpenChange:T=>m({isOpen:T}),children:[e.jsx(o,{children:"Example Dialog"}),e.jsx(s,{children:e.jsx(a,{children:"This is a basic dialog example."})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(r,{variant:"primary",slot:"close",children:"Save"})]})]})}}),n=d.story({args:{defaultOpen:!0,width:600},render:t=>e.jsxs(p,{children:[e.jsx(r,{variant:"secondary",children:"Open Dialog"}),e.jsxs(i,{...t,children:[e.jsx(o,{children:"Long Content Dialog"}),e.jsx(s,{children:e.jsxs(O,{direction:"column",gap:"3",children:[e.jsx(a,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(a,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(a,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."})]})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(r,{variant:"primary",slot:"close",children:"Accept"})]})]})]})}),h=n.extend({args:{defaultOpen:!0,width:void 0,height:500}}),D=n.extend({args:{height:400}}),v=n.extend({args:{defaultOpen:!0,width:"100%",height:"100%"}}),y=d.story({args:{isOpen:!0},render:t=>e.jsxs(p,{...t,children:[e.jsx(r,{variant:"secondary",children:"Delete Item"}),e.jsxs(i,{children:[e.jsx(o,{children:"Confirm Delete"}),e.jsx(s,{children:e.jsx(a,{children:"Are you sure you want to delete this item? This action cannot be undone."})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(r,{variant:"primary",slot:"close",children:"Delete"})]})]})]})}),u=d.story({args:{isOpen:!0},render:t=>e.jsxs(p,{...t,children:[e.jsx(r,{variant:"secondary",children:"Create User"}),e.jsxs(i,{children:[e.jsx(o,{children:"Create New User"}),e.jsx(s,{children:e.jsxs(O,{direction:"column",gap:"3",children:[e.jsx(F,{label:"Name",placeholder:"Enter full name"}),e.jsx(F,{label:"Email",placeholder:"Enter email address"}),e.jsx(S,{label:"Role",options:[{value:"admin",label:"Admin"},{value:"user",label:"User"},{value:"viewer",label:"Viewer"}]})]})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(r,{variant:"primary",slot:"close",children:"Create User"})]})]})]})}),j=d.story({args:{defaultOpen:!0},render:t=>e.jsxs(p,{children:[e.jsx(r,{variant:"secondary",children:"Open Dialog"}),e.jsxs(i,{...t,children:[e.jsx(o,{children:"Overflow Without Height"}),e.jsx(s,{children:e.jsx(O,{direction:"column",gap:"3",children:Array.from({length:20},(b,m)=>e.jsxs(a,{children:["Line ",m+1,": Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]},m))})}),e.jsxs(l,{children:[e.jsx(r,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(r,{variant:"primary",slot:"close",children:"Confirm"})]})]})]})}),f=n.extend({args:{defaultOpen:void 0,width:600,height:400}}),B=u.extend({args:{isOpen:void 0}});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...B.parameters?.docs?.source}}};const Se=["Default","Open","NoTrigger","FixedWidth","FixedHeight","FixedWidthAndHeight","FullWidthAndHeight","Confirmation","WithForm","OverflowWithoutHeight","PreviewFixedWidthAndHeight","PreviewWithForm"];export{y as Confirmation,c as Default,h as FixedHeight,n as FixedWidth,D as FixedWidthAndHeight,v as FullWidthAndHeight,x as NoTrigger,g as Open,j as OverflowWithoutHeight,f as PreviewFixedWidthAndHeight,B as PreviewWithForm,u as WithForm,Se as __namedExportsOrder};
