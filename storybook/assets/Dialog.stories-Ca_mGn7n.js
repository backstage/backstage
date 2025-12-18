import{r as d,a2 as f,j as e,a3 as ae}from"./iframe-BY8lR-L8.js";import{$ as re,a as ie,b as ne,c as oe,d as I,e as se,f as le,g as de,h as ce}from"./Dialog-DWCj1D1z.js";import{$ as ue}from"./Heading-BZARHEPm.js";import{f as me,a as G,$ as pe,e as ge}from"./utils-Bfoe0K7S.js";import{f as J,b as U,d as Q}from"./useObjectRef-BqHG6lM5.js";import{$ as X}from"./useFocusable-C9C81vz2.js";import{$ as z,a as fe}from"./useListState-BajvDkMa.js";import{$ as Z,a as he,b as V}from"./OverlayArrow-Baucl-Ka.js";import{c as $}from"./clsx-B-dksMZM.js";import{P as xe}from"./index-BNUW6RWV.js";import{u as P}from"./useStyles-DPxfsz7Y.js";import{F as L}from"./Flex-evfLyDkg.js";import{B as c}from"./Button-B2n63W61.js";import{T as K}from"./TextField-kHgSqWZ2.js";import{T as v}from"./Text-DFii9vrK.js";import{S as be}from"./Select-ENp31Oe5.js";import"./preload-helper-PPVm8Dsz.js";import"./ListBox-PIasHsVA.js";import"./RSPContexts-CKOFLTkU.js";import"./SelectionIndicator-_0G77Na2.js";import"./Text-BKaXOxx7.js";import"./useLabel-C6JDtQl3.js";import"./useLabels-BYtztTEe.js";import"./usePress-BOtSC_Hg.js";import"./useFocusRing-BEbWKVlK.js";import"./context-BawLJTMw.js";import"./useEvent-DJMP_cBu.js";import"./useLocalizedStringFormatter-DWxB_tcq.js";import"./useControlledState--yapVw-x.js";import"./Button-DZR8lu4n.js";import"./Label-g_-FIzgL.js";import"./Hidden-BOGSyjem.js";import"./VisuallyHidden-eBlVDRmb.js";import"./Button.module-BPzqtDAO.js";import"./Input-Cwa4mYR8.js";import"./useFormReset-SyrVROTP.js";import"./Form-B7AsXGvr.js";import"./TextField-DbAvWVb8.js";import"./FieldError-j_Sj5TL2.js";import"./FieldLabel-CFAagGUM.js";import"./FieldError-RReYZ_oD.js";import"./SearchField-CgV6XqC-.js";let m=typeof document<"u"&&window.visualViewport;function ye(){let a=J(),[t,r]=d.useState(()=>a?{width:0,height:0}:k());return d.useEffect(()=>{let i=()=>{m&&m.scale>1||r(n=>{let s=k();return s.width===n.width&&s.height===n.height?n:s})},o,l=n=>{m&&m.scale>1||z(n.target)&&(o=requestAnimationFrame(()=>{(!document.activeElement||!z(document.activeElement))&&r(s=>{let u={width:window.innerWidth,height:window.innerHeight};return u.width===s.width&&u.height===s.height?s:u})}))};return window.addEventListener("blur",l,!0),m?m.addEventListener("resize",i):window.addEventListener("resize",i),()=>{cancelAnimationFrame(o),window.removeEventListener("blur",l,!0),m?m.removeEventListener("resize",i):window.removeEventListener("resize",i)}},[]),t}function k(){return{width:m?m.width*m.scale:window.innerWidth,height:m?m.height*m.scale:window.innerHeight}}function De(a,t,r){let{overlayProps:i,underlayProps:o}=re({...a,isOpen:t.isOpen,onClose:t.close},r);return ie({isDisabled:!t.isOpen}),ne(),d.useEffect(()=>{if(t.isOpen&&r.current)return oe([r.current],{shouldUseInert:!0})},[t.isOpen,r]),{modalProps:U(i),underlayProps:o}}const ve=d.createContext(null),M=d.createContext(null),$e=d.forwardRef(function(t,r){if(d.useContext(M))return f.createElement(Y,{...t,modalRef:r},t.children);let{isDismissable:o,isKeyboardDismissDisabled:l,isOpen:n,defaultOpen:s,onOpenChange:u,children:p,isEntering:w,isExiting:B,UNSTABLE_portalContainer:W,shouldCloseOnInteractOutside:ee,...te}=t;return f.createElement(we,{isDismissable:o,isKeyboardDismissDisabled:l,isOpen:n,defaultOpen:s,onOpenChange:u,isEntering:w,isExiting:B,UNSTABLE_portalContainer:W,shouldCloseOnInteractOutside:ee},f.createElement(Y,{...te,modalRef:r},p))});function je(a,t){[a,t]=pe(a,t,ve);let r=d.useContext(I),i=he(a),o=a.isOpen!=null||a.defaultOpen!=null||!r?i:r,l=Q(t),n=d.useRef(null),s=V(l,o.isOpen),u=V(n,o.isOpen),p=s||u||a.isExiting||!1,w=J();return!o.isOpen&&!p||w?null:f.createElement(Oe,{...a,state:o,isExiting:p,overlayRef:l,modalRef:n})}const we=d.forwardRef(je);function Oe({UNSTABLE_portalContainer:a,...t}){let r=t.modalRef,{state:i}=t,{modalProps:o,underlayProps:l}=De(t,i,r),n=Z(t.overlayRef)||t.isEntering||!1,s=G({...t,defaultClassName:"react-aria-ModalOverlay",values:{isEntering:n,isExiting:t.isExiting,state:i}}),u=ye(),p;if(typeof document<"u"){let B=fe(document.body)?document.body:document.scrollingElement||document.documentElement,W=B.getBoundingClientRect().height%1;p=B.scrollHeight-W}let w={...s.style,"--visual-viewport-height":u.height+"px","--page-height":p!==void 0?p+"px":void 0};return f.createElement(le,{isExiting:t.isExiting,portalContainer:a},f.createElement("div",{...U(X(t,{global:!0}),l),...s,style:w,ref:t.overlayRef,"data-entering":n||void 0,"data-exiting":t.isExiting||void 0},f.createElement(ge,{values:[[M,{modalProps:o,modalRef:r,isExiting:t.isExiting,isDismissable:t.isDismissable}],[I,i]]},s.children)))}function Y(a){let{modalProps:t,modalRef:r,isExiting:i,isDismissable:o}=d.useContext(M),l=d.useContext(I),n=d.useMemo(()=>me(a.modalRef,r),[a.modalRef,r]),s=Q(n),u=Z(s),p=G({...a,defaultClassName:"react-aria-Modal",values:{isEntering:u,isExiting:i,state:l}});return f.createElement("div",{...U(X(a,{global:!0}),t),...p,ref:s,"data-entering":u||void 0,"data-exiting":i||void 0},o&&f.createElement(se,{onDismiss:l.close}),p.children)}const A={classNames:{overlay:"bui-DialogOverlay",dialog:"bui-Dialog",header:"bui-DialogHeader",headerTitle:"bui-DialogHeaderTitle",body:"bui-DialogBody",footer:"bui-DialogFooter"}},j={"bui-DialogOverlay":"_bui-DialogOverlay_1eyj7_20","bui-Dialog":"_bui-Dialog_1eyj7_20","fade-in":"_fade-in_1eyj7_1","fade-out":"_fade-out_1eyj7_1","dialog-enter":"_dialog-enter_1eyj7_1","dialog-exit":"_dialog-exit_1eyj7_1","bui-DialogHeader":"_bui-DialogHeader_1eyj7_70","bui-DialogHeaderTitle":"_bui-DialogHeaderTitle_1eyj7_79","bui-DialogFooter":"_bui-DialogFooter_1eyj7_85","bui-DialogBody":"_bui-DialogBody_1eyj7_95"},T=a=>e.jsx(de,{...a}),x=d.forwardRef((a,t)=>{const{classNames:r,cleanedProps:i}=P(A,a),{className:o,children:l,width:n,height:s,style:u,...p}=i;return e.jsx($e,{ref:t,className:$(r.overlay,j[r.overlay]),isDismissable:!0,isKeyboardDismissDisabled:!1,...p,children:e.jsx(ce,{className:$(r.dialog,j[r.dialog],o),style:{"--bui-dialog-min-width":typeof n=="number"?`${n}px`:n||"400px","--bui-dialog-min-height":s?typeof s=="number"?`${s}px`:s:"auto",...u},children:l})})});x.displayName="Dialog";const b=d.forwardRef((a,t)=>{const{classNames:r,cleanedProps:i}=P(A,a),{className:o,children:l,...n}=i;return e.jsxs(L,{ref:t,className:$(r.header,j[r.header],o),...n,children:[e.jsx(ue,{slot:"title",className:$(r.headerTitle,j[r.headerTitle]),children:l}),e.jsx(c,{name:"close","aria-label":"Close",variant:"tertiary",slot:"close",children:e.jsx(xe,{})})]})});b.displayName="DialogHeader";const y=d.forwardRef((a,t)=>{const{classNames:r,cleanedProps:i}=P(A,a),{className:o,children:l,...n}=i;return e.jsx("div",{className:$(r.body,j[r.body],o),ref:t,...n,children:l})});y.displayName="DialogBody";const D=d.forwardRef((a,t)=>{const{classNames:r,cleanedProps:i}=P(A,a),{className:o,children:l,...n}=i;return e.jsx("div",{ref:t,className:$(r.footer,j[r.footer],o),...n,children:l})});D.displayName="DialogFooter";T.__docgenInfo={description:"@public",methods:[],displayName:"DialogTrigger",composes:["RADialogTriggerProps"]};x.__docgenInfo={description:"@public",methods:[],displayName:"Dialog",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},width:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},height:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""}},composes:["RAModalProps"]};b.__docgenInfo={description:"@public",methods:[],displayName:"DialogHeader",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["RAHeadingProps"]};y.__docgenInfo={description:"@public",methods:[],displayName:"DialogBody",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};D.__docgenInfo={description:"@public",methods:[],displayName:"DialogFooter"};const{useArgs:Ee}=__STORYBOOK_MODULE_PREVIEW_API__,g=ae.meta({title:"Backstage UI/Dialog",component:x,args:{isOpen:void 0,defaultOpen:void 0},argTypes:{isOpen:{control:"boolean"},defaultOpen:{control:"boolean"}}}),O=g.story({render:a=>e.jsxs(T,{children:[e.jsx(c,{variant:"secondary",children:"Open Dialog"}),e.jsxs(x,{...a,children:[e.jsx(b,{children:"Example Dialog"}),e.jsx(y,{children:e.jsx(v,{children:"This is a basic dialog example."})}),e.jsxs(D,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(c,{variant:"primary",slot:"close",children:"Save"})]})]})]})}),_=O.extend({args:{defaultOpen:!0}}),F=g.story({args:{isOpen:!0},render:a=>{const[{isOpen:t},r]=Ee();return e.jsxs(x,{...a,isOpen:t,onOpenChange:i=>r({isOpen:i}),children:[e.jsx(b,{children:"Example Dialog"}),e.jsx(y,{children:e.jsx(v,{children:"This is a basic dialog example."})}),e.jsxs(D,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Close"}),e.jsx(c,{variant:"primary",slot:"close",children:"Save"})]})]})}}),h=g.story({args:{defaultOpen:!0,width:600},render:a=>e.jsxs(T,{children:[e.jsx(c,{variant:"secondary",children:"Open Dialog"}),e.jsxs(x,{...a,children:[e.jsx(b,{children:"Long Content Dialog"}),e.jsx(y,{children:e.jsxs(L,{direction:"column",gap:"3",children:[e.jsx(v,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(v,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(v,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."})]})}),e.jsxs(D,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Accept"})]})]})]})}),R=g.story({args:{defaultOpen:!0,height:500},render:h.input.render}),N=g.story({args:{defaultOpen:!0,width:600,height:400},render:h.input.render}),C=g.story({args:{defaultOpen:!0,width:"100%",height:"100%"},render:h.input.render}),S=g.story({args:{isOpen:!0},render:a=>e.jsxs(T,{...a,children:[e.jsx(c,{variant:"secondary",children:"Delete Item"}),e.jsxs(x,{children:[e.jsx(b,{children:"Confirm Delete"}),e.jsx(y,{children:e.jsx(v,{children:"Are you sure you want to delete this item? This action cannot be undone."})}),e.jsxs(D,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Delete"})]})]})]})}),E=g.story({args:{isOpen:!0},render:a=>e.jsxs(T,{...a,children:[e.jsx(c,{variant:"secondary",children:"Create User"}),e.jsxs(x,{children:[e.jsx(b,{children:"Create New User"}),e.jsx(y,{children:e.jsxs(L,{direction:"column",gap:"3",children:[e.jsx(K,{label:"Name",placeholder:"Enter full name"}),e.jsx(K,{label:"Email",placeholder:"Enter email address"}),e.jsx(be,{label:"Role",options:[{value:"admin",label:"Admin"},{value:"user",label:"User"},{value:"viewer",label:"Viewer"}]})]})}),e.jsxs(D,{children:[e.jsx(c,{variant:"secondary",slot:"close",children:"Cancel"}),e.jsx(c,{variant:"primary",slot:"close",children:"Create User"})]})]})]})}),H=g.story({args:{defaultOpen:void 0,width:600,height:400},render:h.input.render}),q=g.story({args:{defaultOpen:void 0},render:E.input.render});O.input.parameters={...O.input.parameters,docs:{...O.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...O.input.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    defaultOpen: true
  }
})`,..._.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...F.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    defaultOpen: true,
    height: 500
  },
  render: FixedWidth.input.render
})`,...R.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    defaultOpen: true,
    width: 600,
    height: 400
  },
  render: FixedWidth.input.render
})`,...N.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    defaultOpen: true,
    width: '100%',
    height: '100%'
  },
  render: FixedWidth.input.render
})`,...C.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...S.input.parameters?.docs?.source}}};E.input.parameters={...E.input.parameters,docs:{...E.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...E.input.parameters?.docs?.source}}};H.input.parameters={...H.input.parameters,docs:{...H.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    defaultOpen: undefined,
    width: 600,
    height: 400
  },
  render: FixedWidth.input.render
})`,...H.input.parameters?.docs?.source}}};q.input.parameters={...q.input.parameters,docs:{...q.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    defaultOpen: undefined
  },
  render: WithForm.input.render
})`,...q.input.parameters?.docs?.source}}};const ft=["Default","Open","NoTrigger","FixedWidth","FixedHeight","FixedWidthAndHeight","FullWidthAndHeight","Confirmation","WithForm","PreviewFixedWidthAndHeight","PreviewWithForm"];export{S as Confirmation,O as Default,R as FixedHeight,h as FixedWidth,N as FixedWidthAndHeight,C as FullWidthAndHeight,F as NoTrigger,_ as Open,H as PreviewFixedWidthAndHeight,q as PreviewWithForm,E as WithForm,ft as __namedExportsOrder};
