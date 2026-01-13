import{r as d,a2 as x,j as e,a5 as ae}from"./iframe-DFN6SAj3.js";import{$ as ne,a as ie,b as re,c as oe,d as U,e as se,f as le,g as de,h as ce}from"./Dialog-_0O8mKte.js";import{$ as ue}from"./Heading-CPlDsaSi.js";import{f as pe,a as G,$ as me,e as ge}from"./utils-Bfjqt0Ay.js";import{f as J,$ as I,d as Q}from"./useObjectRef-Dg08NMj-.js";import{a as X}from"./useFocusable-BqV40-mu.js";import{$ as V,a as fe}from"./useListState-Dq8yYTzv.js";import{$ as Z,a as he,b as z}from"./OverlayArrow-D1Fd-dyl.js";import{c as _}from"./clsx-B-dksMZM.js";import{P as xe}from"./index-CWKYqCX3.js";import{u as A}from"./useStyles-DaQj56o8.js";import{F as L}from"./Flex-Dc6Fn51M.js";import{B as c}from"./Button-Bukakr8I.js";import{T as K}from"./TextField-BH9dwEQL.js";import{T as C}from"./Text-DZ5o8eVF.js";import{S as De}from"./Select-BRidrB8C.js";import"./preload-helper-PPVm8Dsz.js";import"./ListBox-C9Gc4fMw.js";import"./RSPContexts-B9rhbHT1.js";import"./SelectionIndicator-CO7nDxl9.js";import"./Text-wo0eSwpS.js";import"./useLabel-DH47co1_.js";import"./useLabels-8yrTN_aE.js";import"./usePress-vdIMkS3w.js";import"./useFocusRing-BJ5ZSrxY.js";import"./context-DAG0vsnX.js";import"./useEvent-DGXsBPji.js";import"./useLocalizedStringFormatter-B9AAQgKo.js";import"./useControlledState-Brt6Ny7j.js";import"./Button-CewZAUMg.js";import"./Label-DSJtZte4.js";import"./Hidden-B4o_BYU0.js";import"./useButton-4oKFdG4C.js";import"./VisuallyHidden-LKIi0bVz.js";import"./useSurface-CpQk2yDD.js";import"./Button.module-DkEJAzA0.js";import"./Input-CGJSOyE7.js";import"./useFormReset-CQb_uMIr.js";import"./Form-B41r19Qw.js";import"./TextField-CWWl6Qzv.js";import"./FieldError-CqUjgKGD.js";import"./FieldLabel-CC6OPSaD.js";import"./FieldError-Bw3II3bl.js";import"./SearchField-BNsmZb9W.js";let p=typeof document<"u"&&window.visualViewport;function be(){let a=J(),[t,n]=d.useState(()=>a?{width:0,height:0}:k());return d.useEffect(()=>{let i=()=>{p&&p.scale>1||n(r=>{let s=k();return s.width===r.width&&s.height===r.height?r:s})},o,l=r=>{p&&p.scale>1||V(r.target)&&(o=requestAnimationFrame(()=>{(!document.activeElement||!V(document.activeElement))&&n(s=>{let u={width:window.innerWidth,height:window.innerHeight};return u.width===s.width&&u.height===s.height?s:u})}))};return window.addEventListener("blur",l,!0),p?p.addEventListener("resize",i):window.addEventListener("resize",i),()=>{cancelAnimationFrame(o),window.removeEventListener("blur",l,!0),p?p.removeEventListener("resize",i):window.removeEventListener("resize",i)}},[]),t}function k(){return{width:p?p.width*p.scale:window.innerWidth,height:p?p.height*p.scale:window.innerHeight}}function ve(a,t,n){let{overlayProps:i,underlayProps:o}=ne({...a,isOpen:t.isOpen,onClose:t.close},n);return ie({isDisabled:!t.isOpen}),re(),d.useEffect(()=>{if(t.isOpen&&n.current)return oe([n.current],{shouldUseInert:!0})},[t.isOpen,n]),{modalProps:I(i),underlayProps:o}}const ye=d.createContext(null),M=d.createContext(null),$e=d.forwardRef(function(t,n){if(d.useContext(M))return x.createElement(Y,{...t,modalRef:n},t.children);let{isDismissable:o,isKeyboardDismissDisabled:l,isOpen:r,defaultOpen:s,onOpenChange:u,children:m,isEntering:R,isExiting:q,UNSTABLE_portalContainer:W,shouldCloseOnInteractOutside:ee,...te}=t;return x.createElement(Be,{isDismissable:o,isKeyboardDismissDisabled:l,isOpen:r,defaultOpen:s,onOpenChange:u,isEntering:R,isExiting:q,UNSTABLE_portalContainer:W,shouldCloseOnInteractOutside:ee},x.createElement(Y,{...te,modalRef:n},m))});function Oe(a,t){[a,t]=me(a,t,ye);let n=d.useContext(U),i=he(a),o=a.isOpen!=null||a.defaultOpen!=null||!n?i:n,l=Q(t),r=d.useRef(null),s=z(l,o.isOpen),u=z(r,o.isOpen),m=s||u||a.isExiting||!1,R=J();return!o.isOpen&&!m||R?null:x.createElement(Te,{...a,state:o,isExiting:m,overlayRef:l,modalRef:r})}const Be=d.forwardRef(Oe);function Te({UNSTABLE_portalContainer:a,...t}){let n=t.modalRef,{state:i}=t,{modalProps:o,underlayProps:l}=ve(t,i,n),r=Z(t.overlayRef)||t.isEntering||!1,s=G({...t,defaultClassName:"react-aria-ModalOverlay",values:{isEntering:r,isExiting:t.isExiting,state:i}}),u=be(),m;if(typeof document<"u"){let q=fe(document.body)?document.body:document.scrollingElement||document.documentElement,W=q.getBoundingClientRect().height%1;m=q.scrollHeight-W}let R={...s.style,"--visual-viewport-height":u.height+"px","--page-height":m!==void 0?m+"px":void 0};return x.createElement(le,{isExiting:t.isExiting,portalContainer:a},x.createElement("div",{...I(X(t,{global:!0}),l),...s,style:R,ref:t.overlayRef,"data-entering":r||void 0,"data-exiting":t.isExiting||void 0},x.createElement(ge,{values:[[M,{modalProps:o,modalRef:n,isExiting:t.isExiting,isDismissable:t.isDismissable}],[U,i]]},s.children)))}function Y(a){let{modalProps:t,modalRef:n,isExiting:i,isDismissable:o}=d.useContext(M),l=d.useContext(U),r=d.useMemo(()=>pe(a.modalRef,n),[a.modalRef,n]),s=Q(r),u=Z(s),m=G({...a,defaultClassName:"react-aria-Modal",values:{isEntering:u,isExiting:i,state:l}});return x.createElement("div",{...I(X(a,{global:!0}),t),...m,ref:s,"data-entering":u||void 0,"data-exiting":i||void 0},o&&x.createElement(se,{onDismiss:l.close}),m.children)}const P={classNames:{overlay:"bui-DialogOverlay",dialog:"bui-Dialog",header:"bui-DialogHeader",headerTitle:"bui-DialogHeaderTitle",body:"bui-DialogBody",footer:"bui-DialogFooter"}},H={"bui-DialogOverlay":"_bui-DialogOverlay_1eyj7_20","bui-Dialog":"_bui-Dialog_1eyj7_20","fade-in":"_fade-in_1eyj7_1","fade-out":"_fade-out_1eyj7_1","dialog-enter":"_dialog-enter_1eyj7_1","dialog-exit":"_dialog-exit_1eyj7_1","bui-DialogHeader":"_bui-DialogHeader_1eyj7_70","bui-DialogHeaderTitle":"_bui-DialogHeaderTitle_1eyj7_79","bui-DialogFooter":"_bui-DialogFooter_1eyj7_85","bui-DialogBody":"_bui-DialogBody_1eyj7_95"},N=a=>e.jsx(de,{...a}),w=d.forwardRef((a,t)=>{const{classNames:n,cleanedProps:i}=A(P,a),{className:o,children:l,width:r,height:s,style:u,...m}=i;return e.jsx($e,{ref:t,className:_(n.overlay,H[n.overlay]),isDismissable:!0,isKeyboardDismissDisabled:!1,...m,children:e.jsx(ce,{className:_(n.dialog,H[n.dialog],o),style:{"--bui-dialog-min-width":typeof r=="number"?`${r}px`:r||"400px","--bui-dialog-min-height":s?typeof s=="number"?`${s}px`:s:"auto",...u},children:l})})});w.displayName="Dialog";const j=d.forwardRef((a,t)=>{const{classNames:n,cleanedProps:i}=A(P,a),{className:o,children:l,...r}=i;return e.jsxs(L,{ref:t,className:_(n.header,H[n.header],o),...r,children:[e.jsx(ue,{slot:"title",className:_(n.headerTitle,H[n.headerTitle]),children:l}),e.jsx(c,{name:"close","aria-label":"Close",variant:"tertiary",slot:"close",children:e.jsx(xe,{})})]})});j.displayName="DialogHeader";const F=d.forwardRef((a,t)=>{const{classNames:n,cleanedProps:i}=A(P,a),{className:o,children:l,...r}=i;return e.jsx("div",{className:_(n.body,H[n.body],o),ref:t,...r,children:l})});F.displayName="DialogBody";const E=d.forwardRef((a,t)=>{const{classNames:n,cleanedProps:i}=A(P,a),{className:o,children:l,...r}=i;return e.jsx("div",{ref:t,className:_(n.footer,H[n.footer],o),...r,children:l})});E.displayName="DialogFooter";N.__docgenInfo={description:"@public",methods:[],displayName:"DialogTrigger",composes:["RADialogTriggerProps"]};w.__docgenInfo={description:"@public",methods:[],displayName:"Dialog",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},width:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},height:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""}},composes:["RAModalProps"]};j.__docgenInfo={description:"@public",methods:[],displayName:"DialogHeader",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["RAHeadingProps"]};F.__docgenInfo={description:"@public",methods:[],displayName:"DialogBody",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};E.__docgenInfo={description:"@public",methods:[],displayName:"DialogFooter"};const{useArgs:we}=__STORYBOOK_MODULE_PREVIEW_API__,S=ae.meta({title:"Backstage UI/Dialog",component:w,args:{isOpen:void 0,defaultOpen:void 0},argTypes:{isOpen:{control:"boolean"},defaultOpen:{control:"boolean"}}}),f=S.story({render:a=>e.jsxs(N,{children:[e.jsx(c,{variant:"secondary",children:"Open Dialog"}),e.jsxs(w,{...a,children:[e.jsx(j,{children:"Example Dialog"}),e.jsx(F,{children:e.jsx(C,{children:"This is a basic dialog example."})}),e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(c,{variant:"primary",slot:"close",children:"Save"})]})]})]})}),D=f.extend({args:{defaultOpen:!0}}),b=S.story({args:{isOpen:!0},render:a=>{const[{isOpen:t},n]=we();return e.jsxs(w,{...a,isOpen:t,onOpenChange:i=>n({isOpen:i}),children:[e.jsx(j,{children:"Example Dialog"}),e.jsx(F,{children:e.jsx(C,{children:"This is a basic dialog example."})}),e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(c,{variant:"primary",slot:"close",children:"Save"})]})]})}}),g=S.story({args:{defaultOpen:!0,width:600},render:a=>e.jsxs(N,{children:[e.jsx(c,{variant:"secondary",children:"Open Dialog"}),e.jsxs(w,{...a,children:[e.jsx(j,{children:"Long Content Dialog"}),e.jsx(F,{children:e.jsxs(L,{direction:"column",gap:"3",children:[e.jsx(C,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(C,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(C,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."})]})}),e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Accept"})]})]})]})}),v=g.extend({args:{defaultOpen:!0,width:void 0,height:500}}),y=g.extend({args:{height:400}}),$=g.extend({args:{defaultOpen:!0,width:"100%",height:"100%"}}),O=S.story({args:{isOpen:!0},render:a=>e.jsxs(N,{...a,children:[e.jsx(c,{variant:"secondary",children:"Delete Item"}),e.jsxs(w,{children:[e.jsx(j,{children:"Confirm Delete"}),e.jsx(F,{children:e.jsx(C,{children:"Are you sure you want to delete this item? This action cannot be undone."})}),e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Delete"})]})]})]})}),h=S.story({args:{isOpen:!0},render:a=>e.jsxs(N,{...a,children:[e.jsx(c,{variant:"secondary",children:"Create User"}),e.jsxs(w,{children:[e.jsx(j,{children:"Create New User"}),e.jsx(F,{children:e.jsxs(L,{direction:"column",gap:"3",children:[e.jsx(K,{label:"Name",placeholder:"Enter full name"}),e.jsx(K,{label:"Email",placeholder:"Enter email address"}),e.jsx(De,{label:"Role",options:[{value:"admin",label:"Admin"},{value:"user",label:"User"},{value:"viewer",label:"Viewer"}]})]})}),e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Create User"})]})]})]})}),B=g.extend({args:{defaultOpen:void 0,width:600,height:400}}),T=h.extend({args:{isOpen:void 0}});f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{code:`const Default = () => {
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
`,...f.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{code:`const Open = () => <Dialog isOpen={undefined} defaultOpen />;
`,...D.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{code:`const NoTrigger = () => {
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
`,...b.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const FixedWidth = () => (
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
`,...g.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const FixedHeight = () => (
  <Dialog isOpen={undefined} defaultOpen width={undefined} height={500} />
);
`,...v.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{code:`const FixedWidthAndHeight = () => (
  <Dialog isOpen={undefined} defaultOpen={undefined} height={400} />
);
`,...y.input.parameters?.docs?.source}}};$.input.parameters={...$.input.parameters,docs:{...$.input.parameters?.docs,source:{code:`const FullWidthAndHeight = () => (
  <Dialog isOpen={undefined} defaultOpen width="100%" height="100%" />
);
`,...$.input.parameters?.docs?.source}}};O.input.parameters={...O.input.parameters,docs:{...O.input.parameters?.docs,source:{code:`const Confirmation = () => (
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
`,...O.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const WithForm = () => (
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
`,...h.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{code:`const PreviewFixedWidthAndHeight = () => (
  <Dialog isOpen={undefined} defaultOpen={undefined} width={600} height={400} />
);
`,...B.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{code:`const PreviewWithForm = () => (
  <Dialog isOpen={undefined} defaultOpen={undefined} />
);
`,...T.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...f.input.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    defaultOpen: true
  }
})`,...D.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...b.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    defaultOpen: true,
    width: undefined,
    height: 500
  }
})`,...v.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    height: 400
  }
})`,...y.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    defaultOpen: true,
    width: '100%',
    height: '100%'
  }
})`,...$.parameters?.docs?.source}}};O.input.parameters={...O.input.parameters,docs:{...O.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...O.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`FixedWidth.extend({
  args: {
    defaultOpen: undefined,
    width: 600,
    height: 400
  }
})`,...B.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`WithForm.extend({
  args: {
    isOpen: undefined
  }
})`,...T.parameters?.docs?.source}}};const xt=["Default","Open","NoTrigger","FixedWidth","FixedHeight","FixedWidthAndHeight","FullWidthAndHeight","Confirmation","WithForm","PreviewFixedWidthAndHeight","PreviewWithForm"];export{O as Confirmation,f as Default,v as FixedHeight,g as FixedWidth,y as FixedWidthAndHeight,$ as FullWidthAndHeight,b as NoTrigger,D as Open,B as PreviewFixedWidthAndHeight,T as PreviewWithForm,h as WithForm,xt as __namedExportsOrder};
