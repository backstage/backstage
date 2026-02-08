import{p as b,j as e}from"./iframe-BVVWNhNF.js";import{D as y,a as h,b as x,c as D,d as v}from"./Dialog-DSoh5pEE.js";import{T as f}from"./TextField-DIuUz3ot.js";import{B as n}from"./Button-BpoCJr8E.js";import{T as g}from"./Text-CRCrNsnq.js";import{F as O}from"./Flex-CS50wTtA.js";import{S as C}from"./Select-bQPkkDx8.js";import"./preload-helper-PPVm8Dsz.js";import"./Dialog-JV6XifYq.js";import"./Button-Bm135BSn.js";import"./utils-CjiodjOE.js";import"./useObjectRef-DqEMLz3o.js";import"./clsx-B-dksMZM.js";import"./Label-DTLZAQO7.js";import"./Hidden-DggWtAde.js";import"./useFocusable-BBTko2GO.js";import"./useLabel-BVBp0F3h.js";import"./useLabels-C6NirF2g.js";import"./context-CvgYpoK-.js";import"./useButton-CdjMzvZ4.js";import"./usePress-CkQSniU6.js";import"./useFocusRing-Dn5s9iSo.js";import"./RSPContexts-h7q-5nVd.js";import"./OverlayArrow-BbtJTh-v.js";import"./useControlledState-BKeT2ue2.js";import"./SelectionManager-v3mkeV0_.js";import"./useEvent-BXoxFnhy.js";import"./SelectionIndicator-pISk0V0M.js";import"./Separator-BU3U1obT.js";import"./Text-AZcHzXR7.js";import"./useLocalizedStringFormatter-CrRV0-ID.js";import"./animation-N-gJN5J5.js";import"./VisuallyHidden-Bx7xoxSl.js";import"./Heading-DtjO0aT5.js";import"./index-BEqd7C-9.js";import"./useStyles-C0OCQ1xE.js";import"./Input-9sDLmjiN.js";import"./useFormReset-D5TcqgWE.js";import"./useField-C3F2IxLT.js";import"./Form-BpV6zGov.js";import"./TextField-BIfjfYEE.js";import"./FieldError-rCMLrX0g.js";import"./FieldLabel-CqzsNO-z.js";import"./FieldError-CB1yjsEk.js";import"./defineComponent-CVePUQXT.js";import"./useSurface-XvOdfZQa.js";import"./ListBox-E54J7GK8.js";import"./useListState-DfHgCx3I.js";import"./Popover.module-C8s8CqIp.js";import"./Autocomplete-ALDb2j4q.js";import"./SearchField-BW5VRxIO.js";const{useArgs:H}=__STORYBOOK_MODULE_PREVIEW_API__,B=b.meta({title:"Backstage UI/Dialog",component:h,args:{isOpen:void 0,defaultOpen:void 0},argTypes:{isOpen:{control:"boolean"},defaultOpen:{control:"boolean"}}}),r=B.story({render:a=>e.jsxs(y,{children:[e.jsx(n,{variant:"secondary",children:"Open Dialog"}),e.jsxs(h,{...a,children:[e.jsx(x,{children:"Example Dialog"}),e.jsx(D,{children:e.jsx(g,{children:"This is a basic dialog example."})}),e.jsxs(v,{children:[e.jsx(n,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(n,{variant:"primary",slot:"close",children:"Save"})]})]})]})}),i=r.extend({args:{defaultOpen:!0}}),s=B.story({args:{isOpen:!0},render:a=>{const[{isOpen:T},F]=H();return e.jsxs(h,{...a,isOpen:T,onOpenChange:j=>F({isOpen:j}),children:[e.jsx(x,{children:"Example Dialog"}),e.jsx(D,{children:e.jsx(g,{children:"This is a basic dialog example."})}),e.jsxs(v,{children:[e.jsx(n,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(n,{variant:"primary",slot:"close",children:"Save"})]})]})}}),t=B.story({args:{defaultOpen:!0,width:600},render:a=>e.jsxs(y,{children:[e.jsx(n,{variant:"secondary",children:"Open Dialog"}),e.jsxs(h,{...a,children:[e.jsx(x,{children:"Long Content Dialog"}),e.jsx(D,{children:e.jsxs(O,{direction:"column",gap:"3",children:[e.jsx(g,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(g,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(g,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."})]})}),e.jsxs(v,{children:[e.jsx(n,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(n,{variant:"primary",slot:"close",children:"Accept"})]})]})]})}),l=t.extend({args:{defaultOpen:!0,width:void 0,height:500}}),d=t.extend({args:{height:400}}),u=t.extend({args:{defaultOpen:!0,width:"100%",height:"100%"}}),c=B.story({args:{isOpen:!0},render:a=>e.jsxs(y,{...a,children:[e.jsx(n,{variant:"secondary",children:"Delete Item"}),e.jsxs(h,{children:[e.jsx(x,{children:"Confirm Delete"}),e.jsx(D,{children:e.jsx(g,{children:"Are you sure you want to delete this item? This action cannot be undone."})}),e.jsxs(v,{children:[e.jsx(n,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(n,{variant:"primary",slot:"close",children:"Delete"})]})]})]})}),o=B.story({args:{isOpen:!0},render:a=>e.jsxs(y,{...a,children:[e.jsx(n,{variant:"secondary",children:"Create User"}),e.jsxs(h,{children:[e.jsx(x,{children:"Create New User"}),e.jsx(D,{children:e.jsxs(O,{direction:"column",gap:"3",children:[e.jsx(f,{label:"Name",placeholder:"Enter full name"}),e.jsx(f,{label:"Email",placeholder:"Enter email address"}),e.jsx(C,{label:"Role",options:[{value:"admin",label:"Admin"},{value:"user",label:"User"},{value:"viewer",label:"Viewer"}]})]})}),e.jsxs(v,{children:[e.jsx(n,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(n,{variant:"primary",slot:"close",children:"Create User"})]})]})]})}),p=t.extend({args:{defaultOpen:void 0,width:600,height:400}}),m=o.extend({args:{isOpen:void 0}});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => {
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
