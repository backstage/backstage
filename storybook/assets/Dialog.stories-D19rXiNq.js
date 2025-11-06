import{r as d,a4 as g,j as e}from"./iframe-DKl1TaBY.js";import{$ as ee,a as ae,b as re,c as te,d as A,e as ie,f as ne,g as oe,h as se}from"./Dialog-DpWpgszf.js";import{$ as le}from"./Heading-CGYh-m_s.js";import{k,b as W,m as de,l as Y,c as G,$ as ce,i as ue}from"./utils-ih_j407f.js";import{a as J}from"./useFocusRing-m_zlqpNl.js";import{$ as L,a as me}from"./useListState-DtfUdoBM.js";import{$ as Q,a as pe,b as M}from"./OverlayArrow-C9viu7LB.js";import{c as y}from"./clsx-B-dksMZM.js";import{P as ge}from"./index-DnIFsHVM.js";import{u as q}from"./useStyles-CE3xc5I3.js";import{F as I}from"./Flex-Bp51ecym.js";import{B as c}from"./Button-BnoIzI9g.js";import{T as z}from"./TextField-D6mLGXxc.js";import{T as $}from"./Text-CGO_UQFN.js";import{S as fe}from"./Select-CG9zLDnv.js";import"./preload-helper-D9Z9MdNV.js";import"./Button-tZKFDyl-.js";import"./Hidden-C-3P-8TB.js";import"./usePress-Dcs4E9UJ.js";import"./RSPContexts-BzUg7TeD.js";import"./ListBox-Bv0yKMsi.js";import"./SelectionIndicator-BEq20Vmj.js";import"./Text-Bi5gH-cw.js";import"./useLabels-Vp5U3kXQ.js";import"./context-DTIhHctQ.js";import"./useLocalizedStringFormatter-Cs6Ft6bz.js";import"./useEvent-iZ2JTqbT.js";import"./useControlledState-5ZwgRprs.js";import"./VisuallyHidden-T6iAQWzB.js";import"./Button.module-BHYJStbY.js";import"./Input-CCpTS05k.js";import"./useFormReset-BA_u5cn5.js";import"./Form-DYw8-Sqj.js";import"./TextField-DAwzzGJw.js";import"./FieldError-Cwp00kop.js";import"./Label-C8AhOPMe.js";import"./TextField.module-BNd6YL_d.js";import"./FieldLabel-DeFV_Xdi.js";import"./FieldError-1nIu1Yhz.js";let m=typeof document<"u"&&window.visualViewport;function he(){let r=k(),[a,t]=d.useState(()=>r?{width:0,height:0}:V());return d.useEffect(()=>{let i=()=>{m&&m.scale>1||t(n=>{let s=V();return s.width===n.width&&s.height===n.height?n:s})},o,l=n=>{m&&m.scale>1||L(n.target)&&(o=requestAnimationFrame(()=>{(!document.activeElement||!L(document.activeElement))&&t(s=>{let u={width:window.innerWidth,height:window.innerHeight};return u.width===s.width&&u.height===s.height?s:u})}))};return window.addEventListener("blur",l,!0),m?m.addEventListener("resize",i):window.addEventListener("resize",i),()=>{cancelAnimationFrame(o),window.removeEventListener("blur",l,!0),m?m.removeEventListener("resize",i):window.removeEventListener("resize",i)}},[]),a}function V(){return{width:m?m.width*m.scale:window.innerWidth,height:m?m.height*m.scale:window.innerHeight}}function xe(r,a,t){let{overlayProps:i,underlayProps:o}=ee({...r,isOpen:a.isOpen,onClose:a.close},t);return ae({isDisabled:!a.isOpen}),re(),d.useEffect(()=>{if(a.isOpen&&t.current)return te([t.current],{shouldUseInert:!0})},[a.isOpen,t]),{modalProps:W(i),underlayProps:o}}const be=d.createContext(null),U=d.createContext(null),ve=d.forwardRef(function(a,t){if(d.useContext(U))return g.createElement(K,{...a,modalRef:t},a.children);let{isDismissable:o,isKeyboardDismissDisabled:l,isOpen:n,defaultOpen:s,onOpenChange:u,children:p,isEntering:w,isExiting:T,UNSTABLE_portalContainer:P,shouldCloseOnInteractOutside:X,...Z}=a;return g.createElement($e,{isDismissable:o,isKeyboardDismissDisabled:l,isOpen:n,defaultOpen:s,onOpenChange:u,isEntering:w,isExiting:T,UNSTABLE_portalContainer:P,shouldCloseOnInteractOutside:X},g.createElement(K,{...Z,modalRef:t},p))});function De(r,a){[r,a]=ce(r,a,be);let t=d.useContext(A),i=pe(r),o=r.isOpen!=null||r.defaultOpen!=null||!t?i:t,l=Y(a),n=d.useRef(null),s=M(l,o.isOpen),u=M(n,o.isOpen),p=s||u||r.isExiting||!1,w=k();return!o.isOpen&&!p||w?null:g.createElement(ye,{...r,state:o,isExiting:p,overlayRef:l,modalRef:n})}const $e=d.forwardRef(De);function ye({UNSTABLE_portalContainer:r,...a}){let t=a.modalRef,{state:i}=a,{modalProps:o,underlayProps:l}=xe(a,i,t),n=Q(a.overlayRef)||a.isEntering||!1,s=G({...a,defaultClassName:"react-aria-ModalOverlay",values:{isEntering:n,isExiting:a.isExiting,state:i}}),u=he(),p;if(typeof document<"u"){let T=me(document.body)?document.body:document.scrollingElement||document.documentElement,P=T.getBoundingClientRect().height%1;p=T.scrollHeight-P}let w={...s.style,"--visual-viewport-height":u.height+"px","--page-height":p!==void 0?p+"px":void 0};return g.createElement(ne,{isExiting:a.isExiting,portalContainer:r},g.createElement("div",{...W(J(a,{global:!0}),l),...s,style:w,ref:a.overlayRef,"data-entering":n||void 0,"data-exiting":a.isExiting||void 0},g.createElement(ue,{values:[[U,{modalProps:o,modalRef:t,isExiting:a.isExiting,isDismissable:a.isDismissable}],[A,i]]},s.children)))}function K(r){let{modalProps:a,modalRef:t,isExiting:i,isDismissable:o}=d.useContext(U),l=d.useContext(A),n=d.useMemo(()=>de(r.modalRef,t),[r.modalRef,t]),s=Y(n),u=Q(s),p=G({...r,defaultClassName:"react-aria-Modal",values:{isEntering:u,isExiting:i,state:l}});return g.createElement("div",{...W(J(r,{global:!0}),a),...p,ref:s,"data-entering":u||void 0,"data-exiting":i||void 0},o&&g.createElement(ie,{onDismiss:l.close}),p.children)}const j={"bui-DialogOverlay":"_bui-DialogOverlay_39pvj_20","bui-Dialog":"_bui-Dialog_39pvj_20","fade-in":"_fade-in_39pvj_1","fade-out":"_fade-out_39pvj_1","dialog-enter":"_dialog-enter_39pvj_1","dialog-exit":"_dialog-exit_39pvj_1","bui-DialogHeader":"_bui-DialogHeader_39pvj_70","bui-DialogHeaderTitle":"_bui-DialogHeaderTitle_39pvj_79","bui-DialogFooter":"_bui-DialogFooter_39pvj_85","bui-DialogBody":"_bui-DialogBody_39pvj_95"},E=r=>e.jsx(se,{...r}),h=d.forwardRef((r,a)=>{const{classNames:t,cleanedProps:i}=q("Dialog",r),{className:o,children:l,width:n,height:s,style:u,...p}=i;return e.jsx(ve,{ref:a,className:y(t.overlay,j[t.overlay]),isDismissable:!0,isKeyboardDismissDisabled:!1,...p,children:e.jsx(oe,{className:y(t.dialog,j[t.dialog],o),style:{"--bui-dialog-min-width":typeof n=="number"?`${n}px`:n||"400px","--bui-dialog-min-height":s?typeof s=="number"?`${s}px`:s:"auto",...u},children:l})})});h.displayName="Dialog";const x=d.forwardRef((r,a)=>{const{classNames:t,cleanedProps:i}=q("Dialog",r),{className:o,children:l,...n}=i;return e.jsxs(I,{ref:a,className:y(t.header,j[t.header],o),...n,children:[e.jsx(le,{slot:"title",className:y(t.headerTitle,j[t.headerTitle]),children:l}),e.jsx(c,{name:"close","aria-label":"Close",variant:"tertiary",slot:"close",children:e.jsx(ge,{})})]})});x.displayName="DialogHeader";const b=d.forwardRef((r,a)=>{const{classNames:t,cleanedProps:i}=q("Dialog",r),{className:o,children:l,...n}=i;return e.jsx("div",{className:y(t.body,j[t.body],o),ref:a,...n,children:l})});b.displayName="DialogBody";const v=d.forwardRef((r,a)=>{const{classNames:t,cleanedProps:i}=q("Dialog",r),{className:o,children:l,...n}=i;return e.jsx("div",{ref:a,className:y(t.footer,j[t.footer],o),...n,children:l})});v.displayName="DialogFooter";E.__docgenInfo={description:"@public",methods:[],displayName:"DialogTrigger",composes:["RADialogTriggerProps"]};h.__docgenInfo={description:"@public",methods:[],displayName:"Dialog",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},width:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},height:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""}},composes:["RAModalProps"]};x.__docgenInfo={description:"@public",methods:[],displayName:"DialogHeader",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["RAHeadingProps"]};b.__docgenInfo={description:"@public",methods:[],displayName:"DialogBody",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};v.__docgenInfo={description:"@public",methods:[],displayName:"DialogFooter"};const{useArgs:je}=__STORYBOOK_MODULE_PREVIEW_API__,da={title:"Backstage UI/Dialog",component:h,args:{isOpen:void 0,defaultOpen:void 0},argTypes:{isOpen:{control:"boolean"},defaultOpen:{control:"boolean"}}},D={render:r=>e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",children:"Open Dialog"}),e.jsxs(h,{...r,children:[e.jsx(x,{children:"Example Dialog"}),e.jsx(b,{children:e.jsx($,{children:"This is a basic dialog example."})}),e.jsxs(v,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(c,{variant:"primary",slot:"close",children:"Save"})]})]})]})},B={args:{...D.args,defaultOpen:!0},render:D.render},_={args:{isOpen:!0},render:r=>{const[{isOpen:a},t]=je();return e.jsxs(h,{...r,isOpen:a,onOpenChange:i=>t({isOpen:i}),children:[e.jsx(x,{children:"Example Dialog"}),e.jsx(b,{children:e.jsx($,{children:"This is a basic dialog example."})}),e.jsxs(v,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(c,{variant:"primary",slot:"close",children:"Save"})]})]})}},f={args:{defaultOpen:!0,width:600},render:r=>e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",children:"Open Dialog"}),e.jsxs(h,{...r,children:[e.jsx(x,{children:"Long Content Dialog"}),e.jsx(b,{children:e.jsxs(I,{direction:"column",gap:"3",children:[e.jsx($,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx($,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx($,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."})]})}),e.jsxs(v,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Accept"})]})]})]})},F={args:{defaultOpen:!0,height:500},render:f.render},R={args:{defaultOpen:!0,width:600,height:400},render:f.render},C={args:{defaultOpen:!0,width:"100%",height:"100%"},render:f.render},N={args:{isOpen:!0},render:r=>e.jsxs(E,{...r,children:[e.jsx(c,{variant:"secondary",children:"Delete Item"}),e.jsxs(h,{children:[e.jsx(x,{children:"Confirm Delete"}),e.jsx(b,{children:e.jsx($,{children:"Are you sure you want to delete this item? This action cannot be undone."})}),e.jsxs(v,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Delete"})]})]})]})},O={args:{isOpen:!0},render:r=>e.jsxs(E,{...r,children:[e.jsx(c,{variant:"secondary",children:"Create User"}),e.jsxs(h,{children:[e.jsx(x,{children:"Create New User"}),e.jsx(b,{children:e.jsxs(I,{direction:"column",gap:"3",children:[e.jsx(z,{label:"Name",placeholder:"Enter full name"}),e.jsx(z,{label:"Email",placeholder:"Enter email address"}),e.jsx(fe,{label:"Role",options:[{value:"admin",label:"Admin"},{value:"user",label:"User"},{value:"viewer",label:"Viewer"}]})]})}),e.jsxs(v,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Create User"})]})]})]})},S={args:{defaultOpen:void 0,width:600,height:400},render:f.render},H={args:{defaultOpen:void 0},render:O.render};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultOpen: true
  },
  render: Default.render
}`,...B.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true,
    height: 500
  },
  render: FixedWidth.render
}`,...F.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true,
    width: 600,
    height: 400
  },
  render: FixedWidth.render
}`,...R.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true,
    width: '100%',
    height: '100%'
  },
  render: FixedWidth.render
}`,...C.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: undefined,
    width: 600,
    height: 400
  },
  render: FixedWidth.render
}`,...S.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: undefined
  },
  render: WithForm.render
}`,...H.parameters?.docs?.source}}};const ca=["Default","Open","NoTrigger","FixedWidth","FixedHeight","FixedWidthAndHeight","FullWidthAndHeight","Confirmation","WithForm","PreviewFixedWidthAndHeight","PreviewWithForm"];export{N as Confirmation,D as Default,F as FixedHeight,f as FixedWidth,R as FixedWidthAndHeight,C as FullWidthAndHeight,_ as NoTrigger,B as Open,S as PreviewFixedWidthAndHeight,H as PreviewWithForm,O as WithForm,ca as __namedExportsOrder,da as default};
