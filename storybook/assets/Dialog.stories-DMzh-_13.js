import{r as d,a3 as p,j as e}from"./iframe-B6vHPHUS.js";import{$ as ae,a as re,b as te,c as ie,d as W,e as ne,f as oe,g as se,h as le}from"./Dialog-CjzPPQqn.js";import{$ as de}from"./Heading-BF_4cOrr.js";import{k as Y,c as I,m as ce,l as G,d as J,$ as ue,i as me}from"./utils-Dc-c3eC3.js";import{a as Q}from"./useFocusRing-BPooT00c.js";import{$ as M,a as ge}from"./useListState-Dh1cWBjG.js";import{$ as X,a as pe,b as z}from"./OverlayArrow-8bY4MRMi.js";import{c as $}from"./clsx-B-dksMZM.js";import{P as fe}from"./index-CX60uPmW.js";import{u as q}from"./useStyles-C-y3xpyB.js";import{F as U}from"./Flex-CUF93du8.js";import{B as c}from"./Button-CL-yh1kq.js";import{T as V}from"./TextField-ZHlpqogD.js";import{T as y}from"./Text-B-LjbfPX.js";import{S as he}from"./Select-s9sipjvh.js";import"./preload-helper-D9Z9MdNV.js";import"./ListBox-CDmT3nGj.js";import"./RSPContexts-xdSoOCnd.js";import"./SelectionIndicator-C-ramg4n.js";import"./Text-Gfhg4HaA.js";import"./useLabel-BjKVVapu.js";import"./useLabels-CTSau9A7.js";import"./usePress-D5zWsAX_.js";import"./context-DsQFltCn.js";import"./useEvent-wFMdwlFo.js";import"./useLocalizedStringFormatter-D41dI4UO.js";import"./useControlledState-DWj3SqXj.js";import"./Button-Bk6CObpo.js";import"./Label-Bwu2jGwM.js";import"./Hidden-ByRJzAKI.js";import"./VisuallyHidden-BYZ37Wd1.js";import"./Button.module-BPzqtDAO.js";import"./Input-BwcF8DX8.js";import"./useFormReset-0JlNtNLI.js";import"./Form-Ck--Lsy1.js";import"./TextField-Ck-vjTBj.js";import"./FieldError-CKbDuQo-.js";import"./FieldLabel-BYLy6GKj.js";import"./FieldError-CyibdofI.js";import"./SearchField-4rQZ8u3N.js";let m=typeof document<"u"&&window.visualViewport;function xe(){let r=Y(),[a,t]=d.useState(()=>r?{width:0,height:0}:K());return d.useEffect(()=>{let i=()=>{m&&m.scale>1||t(n=>{let s=K();return s.width===n.width&&s.height===n.height?n:s})},o,l=n=>{m&&m.scale>1||M(n.target)&&(o=requestAnimationFrame(()=>{(!document.activeElement||!M(document.activeElement))&&t(s=>{let u={width:window.innerWidth,height:window.innerHeight};return u.width===s.width&&u.height===s.height?s:u})}))};return window.addEventListener("blur",l,!0),m?m.addEventListener("resize",i):window.addEventListener("resize",i),()=>{cancelAnimationFrame(o),window.removeEventListener("blur",l,!0),m?m.removeEventListener("resize",i):window.removeEventListener("resize",i)}},[]),a}function K(){return{width:m?m.width*m.scale:window.innerWidth,height:m?m.height*m.scale:window.innerHeight}}function be(r,a,t){let{overlayProps:i,underlayProps:o}=ae({...r,isOpen:a.isOpen,onClose:a.close},t);return re({isDisabled:!a.isOpen}),te(),d.useEffect(()=>{if(a.isOpen&&t.current)return ie([t.current],{shouldUseInert:!0})},[a.isOpen,t]),{modalProps:I(i),underlayProps:o}}const De=d.createContext(null),L=d.createContext(null),ve=d.forwardRef(function(a,t){if(d.useContext(L))return p.createElement(k,{...a,modalRef:t},a.children);let{isDismissable:o,isKeyboardDismissDisabled:l,isOpen:n,defaultOpen:s,onOpenChange:u,children:g,isEntering:w,isExiting:T,UNSTABLE_portalContainer:A,shouldCloseOnInteractOutside:Z,...ee}=a;return p.createElement($e,{isDismissable:o,isKeyboardDismissDisabled:l,isOpen:n,defaultOpen:s,onOpenChange:u,isEntering:w,isExiting:T,UNSTABLE_portalContainer:A,shouldCloseOnInteractOutside:Z},p.createElement(k,{...ee,modalRef:t},g))});function ye(r,a){[r,a]=ue(r,a,De);let t=d.useContext(W),i=pe(r),o=r.isOpen!=null||r.defaultOpen!=null||!t?i:t,l=G(a),n=d.useRef(null),s=z(l,o.isOpen),u=z(n,o.isOpen),g=s||u||r.isExiting||!1,w=Y();return!o.isOpen&&!g||w?null:p.createElement(je,{...r,state:o,isExiting:g,overlayRef:l,modalRef:n})}const $e=d.forwardRef(ye);function je({UNSTABLE_portalContainer:r,...a}){let t=a.modalRef,{state:i}=a,{modalProps:o,underlayProps:l}=be(a,i,t),n=X(a.overlayRef)||a.isEntering||!1,s=J({...a,defaultClassName:"react-aria-ModalOverlay",values:{isEntering:n,isExiting:a.isExiting,state:i}}),u=xe(),g;if(typeof document<"u"){let T=ge(document.body)?document.body:document.scrollingElement||document.documentElement,A=T.getBoundingClientRect().height%1;g=T.scrollHeight-A}let w={...s.style,"--visual-viewport-height":u.height+"px","--page-height":g!==void 0?g+"px":void 0};return p.createElement(oe,{isExiting:a.isExiting,portalContainer:r},p.createElement("div",{...I(Q(a,{global:!0}),l),...s,style:w,ref:a.overlayRef,"data-entering":n||void 0,"data-exiting":a.isExiting||void 0},p.createElement(me,{values:[[L,{modalProps:o,modalRef:t,isExiting:a.isExiting,isDismissable:a.isDismissable}],[W,i]]},s.children)))}function k(r){let{modalProps:a,modalRef:t,isExiting:i,isDismissable:o}=d.useContext(L),l=d.useContext(W),n=d.useMemo(()=>ce(r.modalRef,t),[r.modalRef,t]),s=G(n),u=X(s),g=J({...r,defaultClassName:"react-aria-Modal",values:{isEntering:u,isExiting:i,state:l}});return p.createElement("div",{...I(Q(r,{global:!0}),a),...g,ref:s,"data-entering":u||void 0,"data-exiting":i||void 0},o&&p.createElement(ne,{onDismiss:l.close}),g.children)}const P={classNames:{overlay:"bui-DialogOverlay",dialog:"bui-Dialog",header:"bui-DialogHeader",headerTitle:"bui-DialogHeaderTitle",body:"bui-DialogBody",footer:"bui-DialogFooter"}},j={"bui-DialogOverlay":"_bui-DialogOverlay_1eyj7_20","bui-Dialog":"_bui-Dialog_1eyj7_20","fade-in":"_fade-in_1eyj7_1","fade-out":"_fade-out_1eyj7_1","dialog-enter":"_dialog-enter_1eyj7_1","dialog-exit":"_dialog-exit_1eyj7_1","bui-DialogHeader":"_bui-DialogHeader_1eyj7_70","bui-DialogHeaderTitle":"_bui-DialogHeaderTitle_1eyj7_79","bui-DialogFooter":"_bui-DialogFooter_1eyj7_85","bui-DialogBody":"_bui-DialogBody_1eyj7_95"},E=r=>e.jsx(le,{...r}),h=d.forwardRef((r,a)=>{const{classNames:t,cleanedProps:i}=q(P,r),{className:o,children:l,width:n,height:s,style:u,...g}=i;return e.jsx(ve,{ref:a,className:$(t.overlay,j[t.overlay]),isDismissable:!0,isKeyboardDismissDisabled:!1,...g,children:e.jsx(se,{className:$(t.dialog,j[t.dialog],o),style:{"--bui-dialog-min-width":typeof n=="number"?`${n}px`:n||"400px","--bui-dialog-min-height":s?typeof s=="number"?`${s}px`:s:"auto",...u},children:l})})});h.displayName="Dialog";const x=d.forwardRef((r,a)=>{const{classNames:t,cleanedProps:i}=q(P,r),{className:o,children:l,...n}=i;return e.jsxs(U,{ref:a,className:$(t.header,j[t.header],o),...n,children:[e.jsx(de,{slot:"title",className:$(t.headerTitle,j[t.headerTitle]),children:l}),e.jsx(c,{name:"close","aria-label":"Close",variant:"tertiary",slot:"close",children:e.jsx(fe,{})})]})});x.displayName="DialogHeader";const b=d.forwardRef((r,a)=>{const{classNames:t,cleanedProps:i}=q(P,r),{className:o,children:l,...n}=i;return e.jsx("div",{className:$(t.body,j[t.body],o),ref:a,...n,children:l})});b.displayName="DialogBody";const D=d.forwardRef((r,a)=>{const{classNames:t,cleanedProps:i}=q(P,r),{className:o,children:l,...n}=i;return e.jsx("div",{ref:a,className:$(t.footer,j[t.footer],o),...n,children:l})});D.displayName="DialogFooter";E.__docgenInfo={description:"@public",methods:[],displayName:"DialogTrigger",composes:["RADialogTriggerProps"]};h.__docgenInfo={description:"@public",methods:[],displayName:"Dialog",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},width:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},height:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""}},composes:["RAModalProps"]};x.__docgenInfo={description:"@public",methods:[],displayName:"DialogHeader",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["RAHeadingProps"]};b.__docgenInfo={description:"@public",methods:[],displayName:"DialogBody",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};D.__docgenInfo={description:"@public",methods:[],displayName:"DialogFooter"};const{useArgs:we}=__STORYBOOK_MODULE_PREVIEW_API__,ua={title:"Backstage UI/Dialog",component:h,args:{isOpen:void 0,defaultOpen:void 0},argTypes:{isOpen:{control:"boolean"},defaultOpen:{control:"boolean"}}},v={render:r=>e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",children:"Open Dialog"}),e.jsxs(h,{...r,children:[e.jsx(x,{children:"Example Dialog"}),e.jsx(b,{children:e.jsx(y,{children:"This is a basic dialog example."})}),e.jsxs(D,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(c,{variant:"primary",slot:"close",children:"Save"})]})]})]})},B={args:{...v.args,defaultOpen:!0},render:v.render},_={args:{isOpen:!0},render:r=>{const[{isOpen:a},t]=we();return e.jsxs(h,{...r,isOpen:a,onOpenChange:i=>t({isOpen:i}),children:[e.jsx(x,{children:"Example Dialog"}),e.jsx(b,{children:e.jsx(y,{children:"This is a basic dialog example."})}),e.jsxs(D,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(c,{variant:"primary",slot:"close",children:"Save"})]})]})}},f={args:{defaultOpen:!0,width:600},render:r=>e.jsxs(E,{children:[e.jsx(c,{variant:"secondary",children:"Open Dialog"}),e.jsxs(h,{...r,children:[e.jsx(x,{children:"Long Content Dialog"}),e.jsx(b,{children:e.jsxs(U,{direction:"column",gap:"3",children:[e.jsx(y,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(y,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(y,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."})]})}),e.jsxs(D,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Accept"})]})]})]})},F={args:{defaultOpen:!0,height:500},render:f.render},R={args:{defaultOpen:!0,width:600,height:400},render:f.render},N={args:{defaultOpen:!0,width:"100%",height:"100%"},render:f.render},C={args:{isOpen:!0},render:r=>e.jsxs(E,{...r,children:[e.jsx(c,{variant:"secondary",children:"Delete Item"}),e.jsxs(h,{children:[e.jsx(x,{children:"Confirm Delete"}),e.jsx(b,{children:e.jsx(y,{children:"Are you sure you want to delete this item? This action cannot be undone."})}),e.jsxs(D,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Delete"})]})]})]})},O={args:{isOpen:!0},render:r=>e.jsxs(E,{...r,children:[e.jsx(c,{variant:"secondary",children:"Create User"}),e.jsxs(h,{children:[e.jsx(x,{children:"Create New User"}),e.jsx(b,{children:e.jsxs(U,{direction:"column",gap:"3",children:[e.jsx(V,{label:"Name",placeholder:"Enter full name"}),e.jsx(V,{label:"Email",placeholder:"Enter email address"}),e.jsx(he,{label:"Role",options:[{value:"admin",label:"Admin"},{value:"user",label:"User"},{value:"viewer",label:"Viewer"}]})]})}),e.jsxs(D,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Create User"})]})]})]})},S={args:{defaultOpen:void 0,width:600,height:400},render:f.render},H={args:{defaultOpen:void 0},render:O.render};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};const ma=["Default","Open","NoTrigger","FixedWidth","FixedHeight","FixedWidthAndHeight","FullWidthAndHeight","Confirmation","WithForm","PreviewFixedWidthAndHeight","PreviewWithForm"];export{C as Confirmation,v as Default,F as FixedHeight,f as FixedWidth,R as FixedWidthAndHeight,N as FullWidthAndHeight,_ as NoTrigger,B as Open,S as PreviewFixedWidthAndHeight,H as PreviewWithForm,O as WithForm,ma as __namedExportsOrder,ua as default};
