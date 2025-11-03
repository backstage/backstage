import{r as d,a4 as p,j as e}from"./iframe-D-w6RxGv.js";import{$ as ae,a as re,b as te,c as ie,d as A,e as ne,f as oe,g as se,h as le}from"./Dialog-DNbaCRPz.js";import{b as de}from"./RSPContexts-BLf_W-sb.js";import{k,$ as W,c as Y,m as ce,l as G,b as J,i as ue}from"./utils-DGD-2B-R.js";import{a as Q}from"./useFocusRing-DWZsk0-g.js";import{$ as L,a as me}from"./useListState-BGXaWCgQ.js";import{$ as X,a as ge,b as M}from"./OverlayArrow-C_SiN945.js";import{c as y}from"./clsx-B-dksMZM.js";import{P as pe}from"./index-DiR7Z3c7.js";import{u as P}from"./useStyles-Cd9RkdK8.js";import{F as I}from"./Flex-BiQL9uGd.js";import{B as c}from"./Button-YB-sfOU7.js";import{T as z}from"./TextField-BouMVnZC.js";import{T as $}from"./Text-CqtGvYow.js";import{S as fe}from"./Select-DyTwZYb4.js";import"./preload-helper-D9Z9MdNV.js";import"./Button-DS_q7_gF.js";import"./Hidden-CRACug8J.js";import"./usePress-DWKZua81.js";import"./ListBox--TmwaW5e.js";import"./SelectionIndicator--PDgEyYa.js";import"./Text-BacNss1s.js";import"./useLabels-Dad0g-N2.js";import"./context-Bf1dRGNL.js";import"./useLocalizedStringFormatter-D0Ixpy99.js";import"./useControlledState-BXBRvxOS.js";import"./VisuallyHidden-BXYAF4ov.js";import"./Button.module-BHYJStbY.js";import"./Input-ZaFjqHfk.js";import"./useFormReset-DK1Xmumq.js";import"./Form-D9kc8UgZ.js";import"./TextField-ASDNqatw.js";import"./FieldError-DBkJmO70.js";import"./Label-DY-UDYo-.js";import"./TextField.module-BNd6YL_d.js";import"./FieldLabel-Bw2UxdTB.js";import"./FieldError-B_Rn6aFt.js";let m=typeof document<"u"&&window.visualViewport;function he(){let t=k(),[a,r]=d.useState(()=>t?{width:0,height:0}:V());return d.useEffect(()=>{let i=()=>{m&&m.scale>1||r(n=>{let s=V();return s.width===n.width&&s.height===n.height?n:s})},o,l=n=>{m&&m.scale>1||L(n.target)&&(o=requestAnimationFrame(()=>{(!document.activeElement||!L(document.activeElement))&&r(s=>{let u={width:window.innerWidth,height:window.innerHeight};return u.width===s.width&&u.height===s.height?s:u})}))};return window.addEventListener("blur",l,!0),m?m.addEventListener("resize",i):window.addEventListener("resize",i),()=>{cancelAnimationFrame(o),window.removeEventListener("blur",l,!0),m?m.removeEventListener("resize",i):window.removeEventListener("resize",i)}},[]),a}function V(){return{width:m?m.width*m.scale:window.innerWidth,height:m?m.height*m.scale:window.innerHeight}}function xe(t,a,r){let{overlayProps:i,underlayProps:o}=ae({...t,isOpen:a.isOpen,onClose:a.close},r);return re({isDisabled:!a.isOpen}),te(),d.useEffect(()=>{if(a.isOpen&&r.current)return ie([r.current],{shouldUseInert:!0})},[a.isOpen,r]),{modalProps:W(i),underlayProps:o}}const be=d.forwardRef(function(a,r){[a,r]=Y(a,r,de);let{children:i,level:o=3,className:l,...n}=a,s=`h${o}`;return p.createElement(s,{...n,ref:r,className:l??"react-aria-Heading"},i)}),ve=d.createContext(null),U=d.createContext(null),De=d.forwardRef(function(a,r){if(d.useContext(U))return p.createElement(K,{...a,modalRef:r},a.children);let{isDismissable:o,isKeyboardDismissDisabled:l,isOpen:n,defaultOpen:s,onOpenChange:u,children:g,isEntering:w,isExiting:T,UNSTABLE_portalContainer:q,shouldCloseOnInteractOutside:Z,...ee}=a;return p.createElement(ye,{isDismissable:o,isKeyboardDismissDisabled:l,isOpen:n,defaultOpen:s,onOpenChange:u,isEntering:w,isExiting:T,UNSTABLE_portalContainer:q,shouldCloseOnInteractOutside:Z},p.createElement(K,{...ee,modalRef:r},g))});function $e(t,a){[t,a]=Y(t,a,ve);let r=d.useContext(A),i=ge(t),o=t.isOpen!=null||t.defaultOpen!=null||!r?i:r,l=G(a),n=d.useRef(null),s=M(l,o.isOpen),u=M(n,o.isOpen),g=s||u||t.isExiting||!1,w=k();return!o.isOpen&&!g||w?null:p.createElement(je,{...t,state:o,isExiting:g,overlayRef:l,modalRef:n})}const ye=d.forwardRef($e);function je({UNSTABLE_portalContainer:t,...a}){let r=a.modalRef,{state:i}=a,{modalProps:o,underlayProps:l}=xe(a,i,r),n=X(a.overlayRef)||a.isEntering||!1,s=J({...a,defaultClassName:"react-aria-ModalOverlay",values:{isEntering:n,isExiting:a.isExiting,state:i}}),u=he(),g;if(typeof document<"u"){let T=me(document.body)?document.body:document.scrollingElement||document.documentElement,q=T.getBoundingClientRect().height%1;g=T.scrollHeight-q}let w={...s.style,"--visual-viewport-height":u.height+"px","--page-height":g!==void 0?g+"px":void 0};return p.createElement(oe,{isExiting:a.isExiting,portalContainer:t},p.createElement("div",{...W(Q(a,{global:!0}),l),...s,style:w,ref:a.overlayRef,"data-entering":n||void 0,"data-exiting":a.isExiting||void 0},p.createElement(ue,{values:[[U,{modalProps:o,modalRef:r,isExiting:a.isExiting,isDismissable:a.isDismissable}],[A,i]]},s.children)))}function K(t){let{modalProps:a,modalRef:r,isExiting:i,isDismissable:o}=d.useContext(U),l=d.useContext(A),n=d.useMemo(()=>ce(t.modalRef,r),[t.modalRef,r]),s=G(n),u=X(s),g=J({...t,defaultClassName:"react-aria-Modal",values:{isEntering:u,isExiting:i,state:l}});return p.createElement("div",{...W(Q(t,{global:!0}),a),...g,ref:s,"data-entering":u||void 0,"data-exiting":i||void 0},o&&p.createElement(ne,{onDismiss:l.close}),g.children)}const j={"bui-DialogOverlay":"_bui-DialogOverlay_39pvj_20","bui-Dialog":"_bui-Dialog_39pvj_20","fade-in":"_fade-in_39pvj_1","fade-out":"_fade-out_39pvj_1","dialog-enter":"_dialog-enter_39pvj_1","dialog-exit":"_dialog-exit_39pvj_1","bui-DialogHeader":"_bui-DialogHeader_39pvj_70","bui-DialogHeaderTitle":"_bui-DialogHeaderTitle_39pvj_79","bui-DialogFooter":"_bui-DialogFooter_39pvj_85","bui-DialogBody":"_bui-DialogBody_39pvj_95"},E=t=>e.jsx(le,{...t}),h=d.forwardRef((t,a)=>{const{classNames:r,cleanedProps:i}=P("Dialog",t),{className:o,children:l,width:n,height:s,style:u,...g}=i;return e.jsx(De,{ref:a,className:y(r.overlay,j[r.overlay]),isDismissable:!0,isKeyboardDismissDisabled:!1,...g,children:e.jsx(se,{className:y(r.dialog,j[r.dialog],o),style:{"--bui-dialog-min-width":typeof n=="number"?`${n}px`:n||"400px","--bui-dialog-min-height":s?typeof s=="number"?`${s}px`:s:"auto",...u},children:l})})});h.displayName="Dialog";const x=d.forwardRef((t,a)=>{const{classNames:r,cleanedProps:i}=P("Dialog",t),{className:o,children:l,...n}=i;return e.jsxs(I,{ref:a,className:y(r.header,j[r.header],o),...n,children:[e.jsx(be,{slot:"title",className:y(r.headerTitle,j[r.headerTitle]),children:l}),e.jsx(c,{name:"close","aria-label":"Close",variant:"tertiary",slot:"close",children:e.jsx(pe,{})})]})});x.displayName="DialogHeader";const b=d.forwardRef((t,a)=>{const{classNames:r,cleanedProps:i}=P("Dialog",t),{className:o,children:l,...n}=i;return e.jsx("div",{className:y(r.body,j[r.body],o),ref:a,...n,children:l})});b.displayName="DialogBody";const v=d.forwardRef((t,a)=>{const{classNames:r,cleanedProps:i}=P("Dialog",t),{className:o,children:l,...n}=i;return e.jsx("div",{ref:a,className:y(r.footer,j[r.footer],o),...n,children:l})});v.displayName="DialogFooter";E.__docgenInfo={description:"@public",methods:[],displayName:"DialogTrigger",composes:["RADialogTriggerProps"]};h.__docgenInfo={description:"@public",methods:[],displayName:"Dialog",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},width:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},height:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""}},composes:["RAModalProps"]};x.__docgenInfo={description:"@public",methods:[],displayName:"DialogHeader",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["RAHeadingProps"]};b.__docgenInfo={description:"@public",methods:[],displayName:"DialogBody",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};v.__docgenInfo={description:"@public",methods:[],displayName:"DialogFooter"};const{useArgs:we}=__STORYBOOK_MODULE_PREVIEW_API__,la={title:"Backstage UI/Dialog",component:h,args:{isOpen:void 0,defaultOpen:void 0},argTypes:{isOpen:{control:"boolean"},defaultOpen:{control:"boolean"}}},D={render:t=>e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",children:"Open Dialog"}),e.jsxs(h,{...t,children:[e.jsx(x,{children:"Example Dialog"}),e.jsx(b,{children:e.jsx($,{children:"This is a basic dialog example."})}),e.jsxs(v,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(c,{variant:"primary",slot:"close",children:"Save"})]})]})]})},B={args:{...D.args,defaultOpen:!0},render:D.render},_={args:{isOpen:!0},render:t=>{const[{isOpen:a},r]=we();return e.jsxs(h,{...t,isOpen:a,onOpenChange:i=>r({isOpen:i}),children:[e.jsx(x,{children:"Example Dialog"}),e.jsx(b,{children:e.jsx($,{children:"This is a basic dialog example."})}),e.jsxs(v,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(c,{variant:"primary",slot:"close",children:"Save"})]})]})}},f={args:{defaultOpen:!0,width:600},render:t=>e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",children:"Open Dialog"}),e.jsxs(h,{...t,children:[e.jsx(x,{children:"Long Content Dialog"}),e.jsx(b,{children:e.jsxs(I,{direction:"column",gap:"3",children:[e.jsx($,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx($,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx($,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."})]})}),e.jsxs(v,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Accept"})]})]})]})},R={args:{defaultOpen:!0,height:500},render:f.render},F={args:{defaultOpen:!0,width:600,height:400},render:f.render},N={args:{defaultOpen:!0,width:"100%",height:"100%"},render:f.render},C={args:{isOpen:!0},render:t=>e.jsxs(E,{...t,children:[e.jsx(c,{variant:"secondary",children:"Delete Item"}),e.jsxs(h,{children:[e.jsx(x,{children:"Confirm Delete"}),e.jsx(b,{children:e.jsx($,{children:"Are you sure you want to delete this item? This action cannot be undone."})}),e.jsxs(v,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Delete"})]})]})]})},O={args:{isOpen:!0},render:t=>e.jsxs(E,{...t,children:[e.jsx(c,{variant:"secondary",children:"Create User"}),e.jsxs(h,{children:[e.jsx(x,{children:"Create New User"}),e.jsx(b,{children:e.jsxs(I,{direction:"column",gap:"3",children:[e.jsx(z,{label:"Name",placeholder:"Enter full name"}),e.jsx(z,{label:"Email",placeholder:"Enter email address"}),e.jsx(fe,{label:"Role",options:[{value:"admin",label:"Admin"},{value:"user",label:"User"},{value:"viewer",label:"Viewer"}]})]})}),e.jsxs(v,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Create User"})]})]})]})},S={args:{defaultOpen:void 0,width:600,height:400},render:f.render},H={args:{defaultOpen:void 0},render:O.render};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true,
    height: 500
  },
  render: FixedWidth.render
}`,...R.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true,
    width: 600,
    height: 400
  },
  render: FixedWidth.render
}`,...F.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true,
    width: '100%',
    height: '100%'
  },
  render: FixedWidth.render
}`,...N.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};const da=["Default","Open","NoTrigger","FixedWidth","FixedHeight","FixedWidthAndHeight","FullWidthAndHeight","Confirmation","WithForm","PreviewFixedWidthAndHeight","PreviewWithForm"];export{C as Confirmation,D as Default,R as FixedHeight,f as FixedWidth,F as FixedWidthAndHeight,N as FullWidthAndHeight,_ as NoTrigger,B as Open,S as PreviewFixedWidthAndHeight,H as PreviewWithForm,O as WithForm,da as __namedExportsOrder,la as default};
