import{r as b,R as h,j as d,p as dt}from"./iframe-M9O-K8SB.js";import{A as pt,n as ne,o as mt,d as ie,g as oe}from"./index-BKJKY9Wv.js";import{c as ft,$ as bt}from"./Button-Dkbd3KcU.js";import{$ as ee,a as de,e as pe,c as gt}from"./utils-BXllfVt4.js";import{e as vt,D as _,u as $t,f as yt,g as xt,h as ht,i as Dt,j as me,s as Tt,r as St}from"./SelectionManager-AOhnTTKk.js";import{$ as kt}from"./Label-o9S_v-xF.js";import{c as Q}from"./ListBox-B40TMSiq.js";import{c as Bt}from"./RSPContexts-BdpIjeVF.js";import{$ as ae,a as Pt,c as Lt}from"./SelectionIndicator-yhlvspp_.js";import{a as Et}from"./Text-B7PuQZMK.js";import{a as fe,$ as F,c as wt,f as Ct,d as Kt}from"./useObjectRef-BPFp5snO.js";import{$ as q,P as be,x as W,o as At,N as Rt,a as Mt}from"./useFocusable-BwFERnd_.js";import{b as Gt,a as ge,$ as It}from"./useFocusRing-COnCKKka.js";import{$ as jt,a as zt}from"./useHighlightSelectionDescription-R_dBsfQd.js";import{$ as Nt}from"./useHasTabbableChild-D6MbJ94R.js";import{a as Ft,$ as H,d as Ot}from"./Separator-CPZLX6dD.js";import{$ as Wt}from"./useField-BgIPqRrs.js";import{$ as ve}from"./context-Bv6kxITJ.js";import{$ as Ut}from"./useLocalizedStringFormatter-C4c9cZU5.js";import{a as Vt,$ as _t}from"./useListState-DtLAZGwv.js";import{c as Y}from"./clsx-B-dksMZM.js";import{u as $e}from"./useStyles-BRwt6BXn.js";import{c as Ht}from"./InternalLinkProvider-Bi_DmABW.js";import{M as qt}from"./index-CuiKZooy.js";import{F as Xt}from"./Flex-Bz2InqMs.js";import"./preload-helper-PPVm8Dsz.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./Hidden-DTd05gNK.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./useEvent-BRbGx-1q.js";import"./useControlledState-DzBnLbpE.js";import"./useSurface-CJaN3YoD.js";const te=new WeakMap;function se(n,e){var r;let{id:o}=(r=te.get(n))!==null&&r!==void 0?r:{};if(!o)throw new Error("Unknown list");return`${o}-${Yt(e)}`}function Yt(n){return typeof n=="string"?n.replace(/\s*/g,""):""+n}function Jt(n,e,r){let{isVirtualized:o,keyboardDelegate:a,layoutDelegate:t,onAction:i,disallowTypeAhead:s,linkBehavior:l="action",keyboardNavigationBehavior:p="arrow",escapeKeyBehavior:u="clearSelection",shouldSelectOnPressUp:m}=n;!n["aria-label"]&&!n["aria-labelledby"]&&console.warn("An aria-label or aria-labelledby prop is required for accessibility.");let{listProps:f}=Ft({selectionManager:e.selectionManager,collection:e.collection,disabledKeys:e.disabledKeys,ref:r,keyboardDelegate:a,layoutDelegate:t,isVirtualized:o,selectOnFocus:e.selectionManager.selectionBehavior==="replace",shouldFocusWrap:n.shouldFocusWrap,linkBehavior:l,disallowTypeAhead:s,autoFocus:n.autoFocus,escapeKeyBehavior:u}),y=fe(n.id);te.set(e,{id:y,onAction:i,linkBehavior:l,keyboardNavigationBehavior:p,shouldSelectOnPressUp:m});let g=jt({selectionManager:e.selectionManager,hasItemActions:!!i}),w=Nt(r,{isDisabled:e.collection.size!==0}),D=q(n,{labelable:!0}),P=F(D,{role:"grid",id:y,"aria-multiselectable":e.selectionManager.selectionMode==="multiple"?"true":void 0},e.collection.size===0?{tabIndex:w?-1:0}:f,g);return o&&(P["aria-rowcount"]=e.collection.size,P["aria-colcount"]=1),zt({},e),{gridProps:P}}const le={expand:{ltr:"ArrowRight",rtl:"ArrowLeft"},collapse:{ltr:"ArrowLeft",rtl:"ArrowRight"}};function Qt(n,e,r){var o,a;let{node:t,isVirtualized:i}=n,{direction:s}=ve(),{onAction:l,linkBehavior:p,keyboardNavigationBehavior:u,shouldSelectOnPressUp:m}=te.get(e),f=wt(),y=b.useRef(null),g=()=>{var c;r.current!==null&&(y.current!=null&&t.key!==y.current||!(!((c=r.current)===null||c===void 0)&&c.contains(document.activeElement)))&&W(r.current)},w={},D=n.hasChildItems,P=e.selectionManager.isLink(t.key);if(t!=null&&"expandedKeys"in e){var O,L;let c=(O=(L=e.collection).getChildren)===null||O===void 0?void 0:O.call(L,t.key);D=D||[...c??[]].length>1,l==null&&!P&&e.selectionManager.selectionMode==="none"&&D&&(l=()=>e.toggleKey(t.key));let v=D?e.expandedKeys.has(t.key):void 0,x=1;if(t.level>0&&t?.parentKey!=null){let $=e.collection.getItem(t.parentKey);if($){var C,U;x=[...(C=(U=e.collection).getChildren)===null||C===void 0?void 0:C.call(U,$.key)].filter(ct=>ct.type==="item").length}}else x=[...e.collection].filter($=>$.level===0&&$.type==="item").length;w={"aria-expanded":v,"aria-level":t.level+1,"aria-posinset":t?.index+1,"aria-setsize":x}}let{itemProps:Z,...V}=vt({selectionManager:e.selectionManager,key:t.key,ref:r,isVirtualized:i,shouldSelectOnPressUp:n.shouldSelectOnPressUp||m,onAction:l||!((o=t.props)===null||o===void 0)&&o.onAction?Ct((a=t.props)===null||a===void 0?void 0:a.onAction,l?()=>l(t.key):void 0):void 0,focus:g,linkBehavior:p}),it=c=>{if(!c.currentTarget.contains(c.target)||!r.current||!document.activeElement)return;let v=ae(r.current);if(v.currentNode=document.activeElement,"expandedKeys"in e&&document.activeElement===r.current){if(c.key===le.expand[s]&&e.selectionManager.focusedKey===t.key&&D&&!e.expandedKeys.has(t.key)){e.toggleKey(t.key),c.stopPropagation();return}else if(c.key===le.collapse[s]&&e.selectionManager.focusedKey===t.key&&D&&e.expandedKeys.has(t.key)){e.toggleKey(t.key),c.stopPropagation();return}}switch(c.key){case"ArrowLeft":if(u==="arrow"){let $=s==="rtl"?v.nextNode():v.previousNode();if($)c.preventDefault(),c.stopPropagation(),W($),_($,{containingElement:H(r.current)});else if(c.preventDefault(),c.stopPropagation(),s==="rtl")W(r.current),_(r.current,{containingElement:H(r.current)});else{v.currentNode=r.current;let K=ue(v);K&&(W(K),_(K,{containingElement:H(r.current)}))}}break;case"ArrowRight":if(u==="arrow"){let $=s==="rtl"?v.previousNode():v.nextNode();if($)c.preventDefault(),c.stopPropagation(),W($),_($,{containingElement:H(r.current)});else if(c.preventDefault(),c.stopPropagation(),s==="ltr")W(r.current),_(r.current,{containingElement:H(r.current)});else{v.currentNode=r.current;let K=ue(v);K&&(W(K),_(K,{containingElement:H(r.current)}))}}break;case"ArrowUp":case"ArrowDown":if(!c.altKey&&r.current.contains(c.target)){var x;c.stopPropagation(),c.preventDefault(),(x=r.current.parentElement)===null||x===void 0||x.dispatchEvent(new KeyboardEvent(c.nativeEvent.type,c.nativeEvent))}break}},ot=c=>{if(y.current=t.key,c.target!==r.current){At()||e.selectionManager.setFocusedKey(t.key);return}},at=c=>{if(!(!c.currentTarget.contains(c.target)||!r.current||!document.activeElement))switch(c.key){case"Tab":if(u==="tab"){let v=ae(r.current,{tabbable:!0});v.currentNode=document.activeElement,(c.shiftKey?v.previousNode():v.nextNode())&&c.stopPropagation()}}},st=be(t.props),lt=V.hasAction?st:{},re=F(Z,lt,{role:"row",onKeyDownCapture:it,onKeyDown:at,onFocus:ot,"aria-label":t["aria-label"]||t.textValue||void 0,"aria-selected":e.selectionManager.canSelectItem(t.key)?e.selectionManager.isSelected(t.key):void 0,"aria-disabled":e.selectionManager.isDisabled(t.key)||void 0,"aria-labelledby":f&&(t["aria-label"]||t.textValue)?`${se(e,t.key)} ${f}`:void 0,id:se(e,t.key)});if(i){let{collection:c}=e,v=[...c];re["aria-rowindex"]=v.find(x=>x.type==="section")?[...c.getKeys()].filter(x=>{var $;return(($=c.getItem(x))===null||$===void 0?void 0:$.type)!=="section"}).findIndex(x=>x===t.key)+1:t.index+1}let ut={role:"gridcell","aria-colindex":1};return{rowProps:{...F(re,w)},gridCellProps:ut,descriptionProps:{id:f},...V}}function ue(n){let e=null,r=null;do r=n.lastChild(),r&&(e=r);while(r);return e}const ye=new WeakMap;function Zt(n,e,r){let{direction:o}=ve(),a=n.keyboardDelegate||new Ot({collection:e.collection,ref:r,orientation:"horizontal",direction:o,disabledKeys:e.disabledKeys,disabledBehavior:e.selectionManager.disabledBehavior}),{labelProps:t,fieldProps:i,descriptionProps:s,errorMessageProps:l}=Wt({...n,labelElementType:"span"}),{gridProps:p}=Jt({...n,...i,keyboardDelegate:a,shouldFocusWrap:!0,linkBehavior:"override",keyboardNavigationBehavior:"tab"},e,r),[u,m]=b.useState(!1),{focusWithinProps:f}=Gt({onFocusWithinChange:m}),y=q(n),g=b.useRef(e.collection.size);return b.useEffect(()=>{r.current&&g.current>0&&e.collection.size===0&&u&&r.current.focus(),g.current=e.collection.size},[e.collection.size,u,r]),ye.set(e,{onRemove:n.onRemove}),{gridProps:F(p,y,{role:e.collection.size?"grid":"group","aria-atomic":!1,"aria-relevant":"additions","aria-live":u?"polite":"off",...f,...i}),labelProps:t,descriptionProps:s,errorMessageProps:l}}var xe={};xe={removeButtonLabel:"إزالة",removeDescription:"اضغط على مفتاح DELETE لإزالة علامة."};var he={};he={removeButtonLabel:"Премахване",removeDescription:"Натиснете Delete, за да премахнете маркера."};var De={};De={removeButtonLabel:"Odebrat",removeDescription:"Stisknutím klávesy Delete odeberete značku."};var Te={};Te={removeButtonLabel:"Fjern",removeDescription:"Tryk på Slet for at fjerne tag."};var Se={};Se={removeButtonLabel:"Entfernen",removeDescription:"Auf „Löschen“ drücken, um das Tag zu entfernen."};var ke={};ke={removeButtonLabel:"Κατάργηση",removeDescription:"Πατήστε Διαγραφή για να καταργήσετε την ετικέτα."};var Be={};Be={removeDescription:"Press Delete to remove tag.",removeButtonLabel:"Remove"};var Pe={};Pe={removeButtonLabel:"Quitar",removeDescription:"Pulse Eliminar para quitar la etiqueta."};var Le={};Le={removeButtonLabel:"Eemalda",removeDescription:"Sildi eemaldamiseks vajutage kustutusklahvi Delete."};var Ee={};Ee={removeButtonLabel:"Poista",removeDescription:"Poista tunniste painamalla Poista-painiketta."};var we={};we={removeButtonLabel:"Supprimer",removeDescription:"Appuyez sur Supprimer pour supprimer l’étiquette."};var Ce={};Ce={removeButtonLabel:"הסר",removeDescription:"לחץ על מחק כדי להסיר תג."};var Ke={};Ke={removeButtonLabel:"Ukloni",removeDescription:"Pritisnite Delete za uklanjanje oznake."};var Ae={};Ae={removeButtonLabel:"Eltávolítás",removeDescription:"Nyomja meg a Delete billentyűt a címke eltávolításához."};var Re={};Re={removeButtonLabel:"Rimuovi",removeDescription:"Premi Elimina per rimuovere il tag."};var Me={};Me={removeButtonLabel:"削除",removeDescription:"タグを削除するには、Delete キーを押します。"};var Ge={};Ge={removeButtonLabel:"제거",removeDescription:"태그를 제거하려면 Delete 키를 누르십시오."};var Ie={};Ie={removeButtonLabel:"Pašalinti",removeDescription:"Norėdami pašalinti žymą, paspauskite „Delete“ klavišą."};var je={};je={removeButtonLabel:"Noņemt",removeDescription:"Nospiediet Delete [Dzēst], lai noņemtu tagu."};var ze={};ze={removeButtonLabel:"Fjern",removeDescription:"Trykk på Slett for å fjerne taggen."};var Ne={};Ne={removeButtonLabel:"Verwijderen",removeDescription:"Druk op Verwijderen om de tag te verwijderen."};var Fe={};Fe={removeButtonLabel:"Usuń",removeDescription:"Naciśnij Usuń, aby usunąć znacznik."};var Oe={};Oe={removeButtonLabel:"Remover",removeDescription:"Pressione Delete para remover a tag."};var We={};We={removeButtonLabel:"Eliminar",removeDescription:"Prima Delete para eliminar a tag."};var Ue={};Ue={removeButtonLabel:"Îndepărtaţi",removeDescription:"Apăsați pe Delete (Ștergere) pentru a elimina eticheta."};var Ve={};Ve={removeButtonLabel:"Удалить",removeDescription:"Нажмите DELETE, чтобы удалить тег."};var _e={};_e={removeButtonLabel:"Odstrániť",removeDescription:"Ak chcete odstrániť značku, stlačte kláves Delete."};var He={};He={removeButtonLabel:"Odstrani",removeDescription:"Pritisnite Delete, da odstranite oznako."};var qe={};qe={removeButtonLabel:"Ukloni",removeDescription:"Pritisnite Obriši da biste uklonili oznaku."};var Xe={};Xe={removeButtonLabel:"Ta bort",removeDescription:"Tryck på Radera för att ta bort taggen."};var Ye={};Ye={removeButtonLabel:"Kaldır",removeDescription:"Etiketi kaldırmak için Sil tuşuna basın."};var Je={};Je={removeButtonLabel:"Вилучити",removeDescription:"Натисніть Delete, щоб вилучити тег."};var Qe={};Qe={removeButtonLabel:"删除",removeDescription:"按下“删除”以删除标记。"};var Ze={};Ze={removeButtonLabel:"移除",removeDescription:"按 Delete 鍵以移除標記。"};var et={};et={"ar-AE":xe,"bg-BG":he,"cs-CZ":De,"da-DK":Te,"de-DE":Se,"el-GR":ke,"en-US":Be,"es-ES":Pe,"et-EE":Le,"fi-FI":Ee,"fr-FR":we,"he-IL":Ce,"hr-HR":Ke,"hu-HU":Ae,"it-IT":Re,"ja-JP":Me,"ko-KR":Ge,"lt-LT":Ie,"lv-LV":je,"nb-NO":ze,"nl-NL":Ne,"pl-PL":Fe,"pt-BR":Oe,"pt-PT":We,"ro-RO":Ue,"ru-RU":Ve,"sk-SK":_e,"sl-SI":He,"sr-SP":qe,"sv-SE":Xe,"tr-TR":Ye,"uk-UA":Je,"zh-CN":Qe,"zh-TW":Ze};function er(n){return n&&n.__esModule?n.default:n}function tr(n,e,r){let{item:o}=n,a=Ut(er(et),"@react-aria/tag"),t=fe(),{onRemove:i}=ye.get(e)||{},{rowProps:s,gridCellProps:l,...p}=Qt({node:o},e,r),{descriptionProps:u,...m}=p,f=e.disabledKeys.has(o.key)||o.props.isDisabled,y=V=>{if(V.key==="Delete"||V.key==="Backspace"){if(f)return;V.preventDefault(),e.selectionManager.isSelected(o.key)?i?.(new Set(e.selectionManager.selectedKeys)):i?.(new Set([o.key]))}},g=Rt();g==="virtual"&&typeof window<"u"&&"ontouchstart"in window&&(g="pointer");let w=i&&(g==="keyboard"||g==="virtual")?a.format("removeDescription"):"",D=$t(w),P=o.key===e.selectionManager.focusedKey,O=e.selectionManager.focusedKey!=null,L=-1;!f&&(P||!O)&&(L=0);let C=q(o.props),U=be(o.props),{focusableProps:Z}=Mt({isDisabled:f},r);return{removeButtonProps:{"aria-label":a.format("removeButtonLabel"),"aria-labelledby":`${t} ${s.id}`,isDisabled:f,id:t,onPress:()=>i?i(new Set([o.key])):null},rowProps:F(Z,s,C,U,{tabIndex:L,onKeyDown:i?y:void 0,"aria-describedby":D["aria-describedby"]}),gridCellProps:F(l,{"aria-errormessage":n["aria-errormessage"],"aria-label":n["aria-label"]}),...m,allowsRemoving:!!i}}function tt(n){let{initialItems:e=[],initialSelectedKeys:r,getKey:o=p=>{var u;return(u=p.id)!==null&&u!==void 0?u:p.key},filter:a,initialFilterText:t=""}=n,[i,s]=b.useState({items:e,selectedKeys:r==="all"?"all":new Set(r||[]),filterText:t}),l=b.useMemo(()=>a?i.items.filter(p=>a(p,i.filterText)):i.items,[i.items,i.filterText,a]);return{...i,items:l,...rr({getKey:o},s),getItem(p){return i.items.find(u=>o(u)===p)}}}function rr(n,e){let{cursor:r,getKey:o}=n;return{setSelectedKeys(a){e(t=>({...t,selectedKeys:a}))},addKeysToSelection(a){e(t=>t.selectedKeys==="all"?t:a==="all"?{...t,selectedKeys:"all"}:{...t,selectedKeys:new Set([...t.selectedKeys,...a])})},removeKeysFromSelection(a){e(t=>{if(a==="all")return{...t,selectedKeys:new Set};let i=t.selectedKeys==="all"?new Set(t.items.map(o)):new Set(t.selectedKeys);for(let s of a)i.delete(s);return{...t,selectedKeys:i}})},setFilterText(a){e(t=>({...t,filterText:a}))},insert(a,...t){e(i=>X(i,a,...t))},insertBefore(a,...t){e(i=>{let s=i.items.findIndex(l=>o?.(l)===a);if(s===-1)if(i.items.length===0)s=0;else return i;return X(i,s,...t)})},insertAfter(a,...t){e(i=>{let s=i.items.findIndex(l=>o?.(l)===a);if(s===-1)if(i.items.length===0)s=0;else return i;return X(i,s+1,...t)})},prepend(...a){e(t=>X(t,0,...a))},append(...a){e(t=>X(t,t.items.length,...a))},remove(...a){e(t=>{let i=new Set(a),s=t.items.filter(p=>!i.has(o(p))),l="all";if(t.selectedKeys!=="all"){l=new Set(t.selectedKeys);for(let p of a)l.delete(p)}return r==null&&s.length===0&&(l=new Set),{...t,items:s,selectedKeys:l}})},removeSelectedItems(){e(a=>{if(a.selectedKeys==="all")return{...a,items:[],selectedKeys:new Set};let t=a.selectedKeys,i=a.items.filter(s=>!t.has(o(s)));return{...a,items:i,selectedKeys:new Set}})},move(a,t){e(i=>{let s=i.items.findIndex(u=>o(u)===a);if(s===-1)return i;let l=i.items.slice(),[p]=l.splice(s,1);return l.splice(t,0,p),{...i,items:l}})},moveBefore(a,t){e(i=>{let s=i.items.findIndex(u=>o(u)===a);if(s===-1)return i;let p=(Array.isArray(t)?t:[...t]).map(u=>i.items.findIndex(m=>o(m)===u)).sort((u,m)=>u-m);return ce(i,p,s)})},moveAfter(a,t){e(i=>{let s=i.items.findIndex(u=>o(u)===a);if(s===-1)return i;let p=(Array.isArray(t)?t:[...t]).map(u=>i.items.findIndex(m=>o(m)===u)).sort((u,m)=>u-m);return ce(i,p,s+1)})},update(a,t){e(i=>{let s=i.items.findIndex(p=>o(p)===a);if(s===-1)return i;let l;return typeof t=="function"?l=t(i.items[s]):l=t,{...i,items:[...i.items.slice(0,s),l,...i.items.slice(s+1)]}})}}}function X(n,e,...r){return{...n,items:[...n.items.slice(0,e),...r,...n.items.slice(e)]}}function ce(n,e,r){r-=e.filter(t=>t<r).length;let o=e.map(t=>({from:t,to:r++}));for(let t=0;t<o.length;t++){let i=o[t].from;for(let s=t;s<o.length;s++)o[s].from>i&&o[s].from--}for(let t=0;t<o.length;t++){let i=o[t];for(let s=o.length-1;s>t;s--){let l=o[s];l.from<i.to?i.to++:l.from++}}let a=n.items.slice();for(let t of o){let[i]=a.splice(t.from,1);a.splice(t.to,0,i)}return{...n,items:a}}const nr=b.createContext(null),rt=b.createContext(null),ir=b.forwardRef(function(e,r){return[e,r]=ee(e,r,nr),h.createElement(Q.Provider,{value:null},h.createElement(xt,{content:e.children},o=>h.createElement(or,{props:e,forwardedRef:r,collection:o})))});function or({props:n,forwardedRef:e,collection:r}){let o=b.useRef(null),{id:a,...t}=n;[t,o]=ee(t,o,Bt);let{filter:i,shouldUseVirtualFocus:s,...l}=t,[p,u]=gt(!n["aria-label"]&&!n["aria-labelledby"]),m=Vt({...l,children:void 0,collection:r}),f=_t(m,i),y=q(t,{global:!0}),g=Object.fromEntries(Object.entries(y).map(([C,U])=>[C,C==="id"?U:void 0])),{gridProps:w,labelProps:D,descriptionProps:P,errorMessageProps:O}=Zt({...l,...g,label:u},f,o);var L;return h.createElement("div",{...y,id:a,ref:e,slot:n.slot||void 0,className:(L=n.className)!==null&&L!==void 0?L:"react-aria-TagGroup",style:n.style},h.createElement(pe,{values:[[kt,{...D,elementType:"span",ref:p}],[rt,{...w,ref:o}],[Q,f],[Et,{slots:{description:P,errorMessage:O}}]]},n.children))}const ar=b.forwardRef(function(e,r){return b.useContext(Q)?h.createElement(sr,{props:e,forwardedRef:r}):h.createElement(ht,e)});function sr({props:n,forwardedRef:e}){let r=b.useContext(Q),{CollectionRoot:o}=b.useContext(me),[a,t]=ee({},e,rt),{focusProps:i,isFocused:s,isFocusVisible:l}=ge(),p={isEmpty:r.collection.size===0,isFocused:s,isFocusVisible:l,state:r},u=de({className:n.className,style:n.style,defaultClassName:"react-aria-TagList",values:p}),m=St(r.selectionManager.focusedKey),f=q(n,{global:!0});return h.createElement("div",{...F(f,u,a,i),ref:t,"data-empty":r.collection.size===0||void 0,"data-focused":s||void 0,"data-focus-visible":l||void 0},h.createElement(Lt,null,r.collection.size===0&&n.renderEmptyState?n.renderEmptyState(p):h.createElement(o,{collection:r.collection,persistedKeys:m})))}const lr=yt(Dt,(n,e,r)=>{let o=b.useContext(Q),a=Kt(e),{focusProps:t,isFocusVisible:i}=ge({within:!1}),{rowProps:s,gridCellProps:l,removeButtonProps:p,...u}=tr({item:r},o,a),{hoverProps:m,isHovered:f}=It({isDisabled:!u.allowsSelection,onHoverStart:r.props.onHoverStart,onHoverChange:r.props.onHoverChange,onHoverEnd:r.props.onHoverEnd}),y=de({...n,id:void 0,children:r.rendered,defaultClassName:"react-aria-Tag",values:{...u,isFocusVisible:i,isHovered:f,selectionMode:o.selectionManager.selectionMode,selectionBehavior:o.selectionManager.selectionBehavior}});b.useEffect(()=>{r.textValue},[r.textValue]);let g=q(n,{global:!0});return delete g.id,delete g.onClick,h.createElement("div",{ref:a,...F(g,y,s,t,m),"data-selected":u.isSelected||void 0,"data-disabled":u.isDisabled||void 0,"data-hovered":f||void 0,"data-focused":u.isFocused||void 0,"data-focus-visible":i||void 0,"data-pressed":u.isPressed||void 0,"data-allows-removing":u.allowsRemoving||void 0,"data-selection-mode":o.selectionManager.selectionMode==="none"?void 0:o.selectionManager.selectionMode},h.createElement("div",{...l,style:{display:"contents"}},h.createElement(pe,{values:[[ft,{slots:{remove:p}}],[me,Tt],[Pt,{isSelected:u.isSelected}]]},y.children)))}),nt={classNames:{group:"bui-TagGroup",list:"bui-TagList",tag:"bui-Tag",tagIcon:"bui-TagIcon",tagRemoveButton:"bui-TagRemoveButton"}},J={"bui-TagList":"_bui-TagList_1kpft_20","bui-Tag":"_bui-Tag_1kpft_20","bui-TagRemoveButton":"_bui-TagRemoveButton_1kpft_72","bui-TagIcon":"_bui-TagIcon_1kpft_83"},{RoutingProvider:ur,useRoutingRegistrationEffect:cr}=Ht(),S=n=>{const{classNames:e,cleanedProps:r}=$e(nt,n),{items:o,children:a,renderEmptyState:t,...i}=r;return d.jsx(ur,{children:d.jsx(ir,{className:Y(e.group,J[e.group]),...i,children:d.jsx(ar,{className:Y(e.list,J[e.list]),items:o,renderEmptyState:t,children:a})})})},k=n=>{const{classNames:e,cleanedProps:r}=$e(nt,{size:"small",...n}),{children:o,className:a,icon:t,size:i,href:s,...l}=r,p=typeof o=="string"?o:void 0;return cr(s),d.jsx(lr,{textValue:p,className:Y(e.tag,J[e.tag],a),"data-size":i,href:s,...l,children:({allowsRemoving:u})=>d.jsxs(d.Fragment,{children:[t&&d.jsx("span",{className:Y(e.tagIcon,J[e.tagIcon]),children:t}),o,u&&d.jsx(bt,{className:Y(e.tagRemoveButton,J[e.tagRemoveButton]),slot:"remove",children:d.jsx(pt,{size:16})})]})})};S.__docgenInfo={description:`A component that renders a list of tags.

@public`,methods:[],displayName:"TagGroup",composes:["Omit","Pick"]};k.__docgenInfo={description:`A component that renders a tag.

@public`,methods:[],displayName:"Tag",props:{icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The icon to display in the chip."},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},description:"The size of the chip."}},composes:["ReactAriaTagProps"]};const E=dt.meta({title:"Backstage UI/TagGroup",component:S,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[n=>d.jsx(qt,{children:d.jsx(n,{})})]}),B=[{id:"banana",name:"Banana",icon:d.jsx(ne,{})},{id:"apple",name:"Apple",icon:d.jsx(mt,{}),isDisabled:!0},{id:"orange",name:"Orange",icon:d.jsx(ie,{}),isDisabled:!0},{id:"pear",name:"Pear",icon:d.jsx(oe,{})},{id:"grape",name:"Grape",icon:d.jsx(ne,{})},{id:"pineapple",name:"Pineapple",icon:d.jsx(ie,{})},{id:"strawberry",name:"Strawberry",icon:d.jsx(oe,{})}],T=E.story({args:{"aria-label":"Tag Group"},render:n=>d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{children:e.name},e.id))})}),A=E.story({args:{...T.input.args},render:n=>d.jsxs(Xt,{direction:"column",children:[d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{size:"small",icon:e.icon,children:e.name},e.id))}),d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{size:"medium",icon:e.icon,children:e.name},e.id))})]})}),R=E.story({args:{selectionMode:"single","aria-label":"Tag Group"},render:n=>{const[e,r]=b.useState(new Set(["travel"]));return d.jsx(S,{...n,items:B,selectedKeys:e,onSelectionChange:r,children:o=>d.jsx(k,{children:o.name})})}}),M=E.story({args:{selectionMode:"multiple","aria-label":"Tag Group"},render:n=>{const[e,r]=b.useState(new Set(["travel","shopping"]));return d.jsx(S,{...n,items:B,selectedKeys:e,onSelectionChange:r,children:o=>d.jsx(k,{children:o.name})})}}),G=E.story({args:{...T.input.args},render:n=>d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{icon:e.icon?e.icon:void 0,children:e.name},e.id))})}),I=E.story({render:n=>d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{href:`/items/${e.id}`,children:e.name},e.id))})}),j=E.story({render:n=>d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{isDisabled:e.isDisabled,children:e.name},e.id))})}),z=E.story({args:{...T.input.args},render:n=>{const[e,r]=b.useState(new Set(["travel"])),o=tt({initialItems:B});return d.jsx(S,{...n,items:o.items,onRemove:a=>o.remove(...a),selectedKeys:e,onSelectionChange:r,children:a=>d.jsx(k,{children:a.name})})}}),N=E.story({args:{...T.input.args},render:n=>{const[e,r]=b.useState(new Set(["travel"])),o=tt({initialItems:B});return d.jsx(S,{...n,items:o.items,onRemove:a=>o.remove(...a),selectedKeys:e,onSelectionChange:r,children:a=>d.jsx(k,{icon:a.icon?a.icon:void 0,children:a.name})})}});T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{code:`const Default = () => (
  <TagGroup aria-label="Tag Group">
    {initialList.map((item) => (
      <Tag key={item.id}>{item.name}</Tag>
    ))}
  </TagGroup>
);
`,...T.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex direction="column">
    <TagGroup>
      {initialList.map((item) => (
        <Tag key={item.id} size="small" icon={item.icon}>
          {item.name}
        </Tag>
      ))}
    </TagGroup>
    <TagGroup>
      {initialList.map((item) => (
        <Tag key={item.id} size="medium" icon={item.icon}>
          {item.name}
        </Tag>
      ))}
    </TagGroup>
  </Flex>
);
`,...A.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{code:`const SelectionModeSingle = () => {
  const [selected, setSelected] = useState<Selection>(new Set(["travel"]));

  return (
    <TagGroup
      selectionMode="single"
      aria-label="Tag Group"
      items={initialList}
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {(item) => <Tag>{item.name}</Tag>}
    </TagGroup>
  );
};
`,...R.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{code:`const SelectionModeMultiple = () => {
  const [selected, setSelected] = useState<Selection>(
    new Set(["travel", "shopping"])
  );

  return (
    <TagGroup
      selectionMode="multiple"
      aria-label="Tag Group"
      items={initialList}
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {(item) => <Tag>{item.name}</Tag>}
    </TagGroup>
  );
};
`,...M.input.parameters?.docs?.source}}};G.input.parameters={...G.input.parameters,docs:{...G.input.parameters?.docs,source:{code:`const WithIcon = () => (
  <TagGroup>
    {initialList.map((item) => (
      <Tag key={item.id} icon={item.icon ? item.icon : undefined}>
        {item.name}
      </Tag>
    ))}
  </TagGroup>
);
`,...G.input.parameters?.docs?.source}}};I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{code:`const WithLink = () => (
  <TagGroup>
    {initialList.map((item) => (
      <Tag key={item.id} href={\`/items/\${item.id}\`}>
        {item.name}
      </Tag>
    ))}
  </TagGroup>
);
`,...I.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{code:`const Disabled = () => (
  <TagGroup>
    {initialList.map((item) => (
      <Tag key={item.id} isDisabled={item.isDisabled}>
        {item.name}
      </Tag>
    ))}
  </TagGroup>
);
`,...j.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{code:`const RemovingTags = () => {
  const [selected, setSelected] = useState<Selection>(new Set(["travel"]));

  const list = useListData<ListItem>({
    initialItems: initialList,
  });

  return (
    <TagGroup
      items={list.items}
      onRemove={(keys) => list.remove(...keys)}
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {(item) => <Tag>{item.name}</Tag>}
    </TagGroup>
  );
};
`,...z.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{code:`const WithIconAndRemoveButton = () => {
  const [selected, setSelected] = useState<Selection>(new Set(["travel"]));

  const list = useListData<ListItem>({
    initialItems: initialList,
  });

  return (
    <TagGroup
      items={list.items}
      onRemove={(keys) => list.remove(...keys)}
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {(item) => (
        <Tag icon={item.icon ? item.icon : undefined}>{item.name}</Tag>
      )}
    </TagGroup>
  );
};
`,...N.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Tag Group'
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id}>{item.name}</Tag>)}
    </TagGroup>
})`,...T.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="column">
      <TagGroup {...args}>
        {initialList.map(item => <Tag key={item.id} size="small" icon={item.icon}>
            {item.name}
          </Tag>)}
      </TagGroup>
      <TagGroup {...args}>
        {initialList.map(item => <Tag key={item.id} size="medium" icon={item.icon}>
            {item.name}
          </Tag>)}
      </TagGroup>
    </Flex>
})`,...A.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'single',
    'aria-label': 'Tag Group'
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    return <TagGroup<ListItem> {...args} items={initialList} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...R.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'multiple',
    'aria-label': 'Tag Group'
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel', 'shopping']));
    return <TagGroup<ListItem> {...args} items={initialList} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...M.input.parameters?.docs?.source}}};G.input.parameters={...G.input.parameters,docs:{...G.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} icon={item.icon ? item.icon : undefined}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...G.input.parameters?.docs?.source}}};I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} href={\`/items/\${item.id}\`}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...I.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} isDisabled={item.isDisabled}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...j.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    const list = useListData<ListItem>({
      initialItems: initialList
    });
    return <TagGroup<ListItem> {...args} items={list.items} onRemove={keys => list.remove(...keys)} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...z.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));
    const list = useListData<ListItem>({
      initialItems: initialList
    });
    return <TagGroup<ListItem> {...args} items={list.items} onRemove={keys => list.remove(...keys)} selectedKeys={selected} onSelectionChange={setSelected}>
        {item => <Tag icon={item.icon ? item.icon : undefined}>{item.name}</Tag>}
      </TagGroup>;
  }
})`,...N.input.parameters?.docs?.source}}};const Vr=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{T as Default,j as Disabled,z as RemovingTags,M as SelectionModeMultiple,R as SelectionModeSingle,A as Sizes,G as WithIcon,N as WithIconAndRemoveButton,I as WithLink,Vr as __namedExportsOrder};
