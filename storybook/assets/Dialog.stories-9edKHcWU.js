import{p as b,j as e}from"./iframe-CNJ8DcrC.js";import{D as y,a as h,b as x,c as D,d as v}from"./Dialog-DmUydXyQ.js";import{T as f}from"./TextField-CmSUZiLa.js";import{B as n}from"./Button-Vzu3Jvbs.js";import{T as g}from"./Text-DZ9ojE3W.js";import{F as O}from"./Flex-gznhGsL1.js";import{S as C}from"./Select-Crken4Xc.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-DhxMaNxl.js";import"./Button-BeiFbECh.js";import"./utils-DqzyTKhZ.js";import"./useObjectRef-D4VDTdyV.js";import"./clsx-B-dksMZM.js";import"./Label-CJ-vxwqW.js";import"./Hidden-ubLVAw13.js";import"./useFocusable-BRngNkQp.js";import"./useLabel-BZdBZ-M8.js";import"./useLabels-CtOTMY5s.js";import"./context-BaC93-pS.js";import"./useButton-CBYUCijk.js";import"./usePress-D634pjUp.js";import"./useFocusRing-_R5-3ahM.js";import"./RSPContexts-6RDiUzJW.js";import"./OverlayArrow-DbM2lv9Q.js";import"./useControlledState-CqjGTBew.js";import"./SelectionManager-3zHy28g_.js";import"./useEvent-BTL2BJnf.js";import"./SelectionIndicator-B--I21Py.js";import"./Separator-Q4nsgSR4.js";import"./Text-Cn9vnNz6.js";import"./useLocalizedStringFormatter-BNUwPyU_.js";import"./animation-CFsi5qUo.js";import"./VisuallyHidden-CxpG0c7s.js";import"./Heading-CGFFjWeL.js";import"./index-Bscon1G1.js";import"./useStyles-Ctwz8Mdy.js";import"./Input-Bx1Q9ja8.js";import"./useFormReset-CElrKw0c.js";import"./useField-DsFdjrH-.js";import"./Form-y2WNsJvz.js";import"./TextField-DaNzhq82.js";import"./FieldError-ed3rL4L6.js";import"./FieldLabel-p3nFc0gc.js";import"./FieldError-Cd_1JWen.js";import"./defineComponent-B_6e1-Ln.js";import"./useSurface-psgZOnSF.js";import"./ListBox-BhddLFLW.js";import"./useListState-DHoCQKk8.js";import"./Popover.module-C8s8CqIp.js";import"./Autocomplete-DetZC639.js";import"./SearchField-zRsAF-St.js";const{useArgs:H}=__STORYBOOK_MODULE_PREVIEW_API__,B=b.meta({title:"Backstage UI/Dialog",component:h,args:{isOpen:void 0,defaultOpen:void 0},argTypes:{isOpen:{control:"boolean"},defaultOpen:{control:"boolean"}}}),r=B.story({render:a=>e.jsxs(y,{children:[e.jsx(n,{variant:"secondary",children:"Open Dialog"}),e.jsxs(h,{...a,children:[e.jsx(x,{children:"Example Dialog"}),e.jsx(D,{children:e.jsx(g,{children:"This is a basic dialog example."})}),e.jsxs(v,{children:[e.jsx(n,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(n,{variant:"primary",slot:"close",children:"Save"})]})]})]})}),i=r.extend({args:{defaultOpen:!0}}),s=B.story({args:{isOpen:!0},render:a=>{const[{isOpen:T},F]=H();return e.jsxs(h,{...a,isOpen:T,onOpenChange:j=>F({isOpen:j}),children:[e.jsx(x,{children:"Example Dialog"}),e.jsx(D,{children:e.jsx(g,{children:"This is a basic dialog example."})}),e.jsxs(v,{children:[e.jsx(n,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(n,{variant:"primary",slot:"close",children:"Save"})]})]})}}),t=B.story({args:{defaultOpen:!0,width:600},render:a=>e.jsxs(y,{children:[e.jsx(n,{variant:"secondary",children:"Open Dialog"}),e.jsxs(h,{...a,children:[e.jsx(x,{children:"Long Content Dialog"}),e.jsx(D,{children:e.jsxs(O,{direction:"column",gap:"3",children:[e.jsx(g,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(g,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(g,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."})]})}),e.jsxs(v,{children:[e.jsx(n,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(n,{variant:"primary",slot:"close",children:"Accept"})]})]})]})}),l=t.extend({args:{defaultOpen:!0,width:void 0,height:500}}),d=t.extend({args:{height:400}}),u=t.extend({args:{defaultOpen:!0,width:"100%",height:"100%"}}),c=B.story({args:{isOpen:!0},render:a=>e.jsxs(y,{...a,children:[e.jsx(n,{variant:"secondary",children:"Delete Item"}),e.jsxs(h,{children:[e.jsx(x,{children:"Confirm Delete"}),e.jsx(D,{children:e.jsx(g,{children:"Are you sure you want to delete this item? This action cannot be undone."})}),e.jsxs(v,{children:[e.jsx(n,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(n,{variant:"primary",slot:"close",children:"Delete"})]})]})]})}),o=B.story({args:{isOpen:!0},render:a=>e.jsxs(y,{...a,children:[e.jsx(n,{variant:"secondary",children:"Create User"}),e.jsxs(h,{children:[e.jsx(x,{children:"Create New User"}),e.jsx(D,{children:e.jsxs(O,{direction:"column",gap:"3",children:[e.jsx(f,{label:"Name",placeholder:"Enter full name"}),e.jsx(f,{label:"Email",placeholder:"Enter email address"}),e.jsx(C,{label:"Role",options:[{value:"admin",label:"Admin"},{value:"user",label:"User"},{value:"viewer",label:"Viewer"}]})]})}),e.jsxs(v,{children:[e.jsx(n,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(n,{variant:"primary",slot:"close",children:"Create User"})]})]})]})}),p=t.extend({args:{defaultOpen:void 0,width:600,height:400}}),m=o.extend({args:{isOpen:void 0}});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => {
  return (
    <DialogTrigger>
      <Button variant="secondary">Open Dialog</Button>
      <Dialog isOpen={undefined} defaultOpen={undefined}>
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
    </DialogTrigger>
  );
};
`,...r.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const Open = () => <Dialog isOpen={undefined} defaultOpen />;
`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const NoTrigger = () => {
  const [{ isOpen }, updateArgs] = useArgs();

  return (
    <Dialog
      defaultOpen={undefined}
      isOpen={isOpen}
      onOpenChange={(value) => updateArgs({ isOpen: value })}
    >
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
  );
};
`,...s.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const FixedWidth = () => (
  <DialogTrigger>
    <Button variant="secondary">Open Dialog</Button>
    <Dialog isOpen={undefined} defaultOpen width={600}>
      <DialogHeader>Long Content Dialog</DialogHeader>
      <DialogBody>
        <Flex direction="column" gap="3">
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
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
);
`,...t.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const FixedHeight = () => (
  <Dialog isOpen={undefined} defaultOpen width={undefined} height={500} />
);
`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const FixedWidthAndHeight = () => (
  <Dialog isOpen={undefined} defaultOpen={undefined} height={400} />
);
`,...d.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const FullWidthAndHeight = () => (
  <Dialog isOpen={undefined} defaultOpen width="100%" height="100%" />
);
`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Confirmation = () => (
  <DialogTrigger isOpen defaultOpen={undefined}>
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
);
`,...c.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const WithForm = () => (
  <DialogTrigger isOpen defaultOpen={undefined}>
    <Button variant="secondary">Create User</Button>
    <Dialog>
      <DialogHeader>Create New User</DialogHeader>
      <DialogBody>
        <Flex direction="column" gap="3">
          <TextField label="Name" placeholder="Enter full name" />
          <TextField label="Email" placeholder="Enter email address" />
          <Select
            label="Role"
            options={[
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
              { value: "viewer", label: "Viewer" },
            ]}
          />
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
);
`,...o.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const PreviewFixedWidthAndHeight = () => (
  <Dialog isOpen={undefined} defaultOpen={undefined} width={600} height={400} />
);
`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const PreviewWithForm = () => (
  <Dialog isOpen={undefined} defaultOpen={undefined} />
);
`,...m.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...r.input.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    defaultOpen: true
  }
})`,...i.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    defaultOpen: true,
    width: undefined,
    height: 500
  }
})`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    height: 400
  }
})`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    defaultOpen: true,
    width: '100%',
    height: '100%'
  }
})`,...u.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    defaultOpen: undefined,
    width: 600,
    height: 400
  }
})`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`WithForm.extend({
  args: {
    isOpen: undefined
  }
})`,...m.parameters?.docs?.source}}};const be=["Default","Open","NoTrigger","FixedWidth","FixedHeight","FixedWidthAndHeight","FullWidthAndHeight","Confirmation","WithForm","PreviewFixedWidthAndHeight","PreviewWithForm"];export{c as Confirmation,r as Default,l as FixedHeight,t as FixedWidth,d as FixedWidthAndHeight,u as FullWidthAndHeight,s as NoTrigger,i as Open,p as PreviewFixedWidthAndHeight,m as PreviewWithForm,o as WithForm,be as __namedExportsOrder};
