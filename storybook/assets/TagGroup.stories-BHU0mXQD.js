import{r as b,a2 as h,j as d,a5 as dt}from"./iframe-Du4yWFmh.js";import{A as pt,k as ne,l as mt,e as ie,g as ae}from"./index-CKR81--4.js";import{b as ft,$ as bt}from"./Button-lMiHrIqc.js";import{e as gt,D as _,u as vt,f as $t,g as yt,h as xt,i as ht,j as de,r as Dt,s as Tt}from"./SelectionManager-0uJxHsG8.js";import{$ as ee,a as pe,e as me,c as St}from"./utils-z8eUZOh4.js";import{$ as kt}from"./Label-CLPT-Yyh.js";import{c as Q}from"./ListBox-BCNTmCbD.js";import{c as Bt}from"./RSPContexts-D_Pwck-t.js";import{$ as oe,a as Pt,c as Lt}from"./SelectionIndicator-BqsEK7dV.js";import{a as Et}from"./Text-ViNXGalI.js";import{b as fe,$ as F,c as wt,g as Ct,e as Kt}from"./useObjectRef-CiRgIA98.js";import{a as q,t as W,j as At,J as Mt,$ as Gt}from"./useFocusable-Dw78h-Dw.js";import{b as It,a as be,$ as Rt}from"./useFocusRing-BvDmeMSb.js";import{$ as jt,a as zt}from"./useHighlightSelectionDescription-CBw_rxCp.js";import{$ as Nt}from"./useHasTabbableChild-DRqG6DwV.js";import{a as Ft,$ as H,d as Ot}from"./Separator-B52XnveC.js";import{$ as Wt}from"./useField-FWFEttl4.js";import{$ as ge}from"./context-q9taPD0R.js";import{f as ve,d as Ut}from"./usePress-qtOIFA-H.js";import{$ as Vt}from"./useLocalizedStringFormatter-DAzOeBuS.js";import{a as _t,$ as Ht}from"./useListState-DOyHQgil.js";import{c as X}from"./clsx-B-dksMZM.js";import{u as $e}from"./useStyles-BKv47l2R.js";import{i as qt}from"./isExternalLink-DzQTpl4p.js";import{c as Jt,f as Xt,M as Yt}from"./index-Br3zvZN_.js";import{F as Qt}from"./Flex-DXAsyrg5.js";import"./preload-helper-PPVm8Dsz.js";import"./useLabel-CbYskFmA.js";import"./useLabels-Blszi5gD.js";import"./Hidden-BnC0bDpJ.js";import"./useButton-p9vkKM9a.js";import"./useEvent-DjPRkiw2.js";import"./useControlledState-Ck_KVpu8.js";import"./useSurface-BX-jw8YI.js";const te=new WeakMap;function se(n,e){var r;let{id:a}=(r=te.get(n))!==null&&r!==void 0?r:{};if(!a)throw new Error("Unknown list");return`${a}-${Zt(e)}`}function Zt(n){return typeof n=="string"?n.replace(/\s*/g,""):""+n}function er(n,e,r){let{isVirtualized:a,keyboardDelegate:o,layoutDelegate:t,onAction:i,disallowTypeAhead:s,linkBehavior:l="action",keyboardNavigationBehavior:p="arrow",escapeKeyBehavior:u="clearSelection",shouldSelectOnPressUp:m}=n;!n["aria-label"]&&!n["aria-labelledby"]&&console.warn("An aria-label or aria-labelledby prop is required for accessibility.");let{listProps:f}=Ft({selectionManager:e.selectionManager,collection:e.collection,disabledKeys:e.disabledKeys,ref:r,keyboardDelegate:o,layoutDelegate:t,isVirtualized:a,selectOnFocus:e.selectionManager.selectionBehavior==="replace",shouldFocusWrap:n.shouldFocusWrap,linkBehavior:l,disallowTypeAhead:s,autoFocus:n.autoFocus,escapeKeyBehavior:u}),g=fe(n.id);te.set(e,{id:g,onAction:i,linkBehavior:l,keyboardNavigationBehavior:p,shouldSelectOnPressUp:m});let v=jt({selectionManager:e.selectionManager,hasItemActions:!!i}),w=Nt(r,{isDisabled:e.collection.size!==0}),D=q(n,{labelable:!0}),P=F(D,{role:"grid",id:g,"aria-multiselectable":e.selectionManager.selectionMode==="multiple"?"true":void 0},e.collection.size===0?{tabIndex:w?-1:0}:f,v);return a&&(P["aria-rowcount"]=e.collection.size,P["aria-colcount"]=1),zt({},e),{gridProps:P}}const le={expand:{ltr:"ArrowRight",rtl:"ArrowLeft"},collapse:{ltr:"ArrowLeft",rtl:"ArrowRight"}};function tr(n,e,r){var a,o;let{node:t,isVirtualized:i}=n,{direction:s}=ge(),{onAction:l,linkBehavior:p,keyboardNavigationBehavior:u,shouldSelectOnPressUp:m}=te.get(e),f=wt(),g=b.useRef(null),v=()=>{var c;r.current!==null&&(g.current!=null&&t.key!==g.current||!(!((c=r.current)===null||c===void 0)&&c.contains(document.activeElement)))&&W(r.current)},w={},D=n.hasChildItems,P=e.selectionManager.isLink(t.key);if(t!=null&&"expandedKeys"in e){var O,L;let c=(O=(L=e.collection).getChildren)===null||O===void 0?void 0:O.call(L,t.key);D=D||[...c??[]].length>1,l==null&&!P&&e.selectionManager.selectionMode==="none"&&D&&(l=()=>e.toggleKey(t.key));let $=D?e.expandedKeys.has(t.key):void 0,x=1;if(t.level>0&&t?.parentKey!=null){let y=e.collection.getItem(t.parentKey);if(y){var C,U;x=[...(C=(U=e.collection).getChildren)===null||C===void 0?void 0:C.call(U,y.key)].filter(ct=>ct.type==="item").length}}else x=[...e.collection].filter(y=>y.level===0&&y.type==="item").length;w={"aria-expanded":$,"aria-level":t.level+1,"aria-posinset":t?.index+1,"aria-setsize":x}}let{itemProps:Z,...V}=gt({selectionManager:e.selectionManager,key:t.key,ref:r,isVirtualized:i,shouldSelectOnPressUp:n.shouldSelectOnPressUp||m,onAction:l||!((a=t.props)===null||a===void 0)&&a.onAction?Ct((o=t.props)===null||o===void 0?void 0:o.onAction,l?()=>l(t.key):void 0):void 0,focus:v,linkBehavior:p}),it=c=>{if(!c.currentTarget.contains(c.target)||!r.current||!document.activeElement)return;let $=oe(r.current);if($.currentNode=document.activeElement,"expandedKeys"in e&&document.activeElement===r.current){if(c.key===le.expand[s]&&e.selectionManager.focusedKey===t.key&&D&&!e.expandedKeys.has(t.key)){e.toggleKey(t.key),c.stopPropagation();return}else if(c.key===le.collapse[s]&&e.selectionManager.focusedKey===t.key&&D&&e.expandedKeys.has(t.key)){e.toggleKey(t.key),c.stopPropagation();return}}switch(c.key){case"ArrowLeft":if(u==="arrow"){let y=s==="rtl"?$.nextNode():$.previousNode();if(y)c.preventDefault(),c.stopPropagation(),W(y),_(y,{containingElement:H(r.current)});else if(c.preventDefault(),c.stopPropagation(),s==="rtl")W(r.current),_(r.current,{containingElement:H(r.current)});else{$.currentNode=r.current;let K=ue($);K&&(W(K),_(K,{containingElement:H(r.current)}))}}break;case"ArrowRight":if(u==="arrow"){let y=s==="rtl"?$.previousNode():$.nextNode();if(y)c.preventDefault(),c.stopPropagation(),W(y),_(y,{containingElement:H(r.current)});else if(c.preventDefault(),c.stopPropagation(),s==="ltr")W(r.current),_(r.current,{containingElement:H(r.current)});else{$.currentNode=r.current;let K=ue($);K&&(W(K),_(K,{containingElement:H(r.current)}))}}break;case"ArrowUp":case"ArrowDown":if(!c.altKey&&r.current.contains(c.target)){var x;c.stopPropagation(),c.preventDefault(),(x=r.current.parentElement)===null||x===void 0||x.dispatchEvent(new KeyboardEvent(c.nativeEvent.type,c.nativeEvent))}break}},at=c=>{if(g.current=t.key,c.target!==r.current){At()||e.selectionManager.setFocusedKey(t.key);return}},ot=c=>{if(!(!c.currentTarget.contains(c.target)||!r.current||!document.activeElement))switch(c.key){case"Tab":if(u==="tab"){let $=oe(r.current,{tabbable:!0});$.currentNode=document.activeElement,(c.shiftKey?$.previousNode():$.nextNode())&&c.stopPropagation()}}},st=ve(t.props),lt=V.hasAction?st:{},re=F(Z,lt,{role:"row",onKeyDownCapture:it,onKeyDown:ot,onFocus:at,"aria-label":t.textValue||void 0,"aria-selected":e.selectionManager.canSelectItem(t.key)?e.selectionManager.isSelected(t.key):void 0,"aria-disabled":e.selectionManager.isDisabled(t.key)||void 0,"aria-labelledby":f&&t.textValue?`${se(e,t.key)} ${f}`:void 0,id:se(e,t.key)});if(i){let{collection:c}=e,$=[...c];re["aria-rowindex"]=$.find(x=>x.type==="section")?[...c.getKeys()].filter(x=>{var y;return((y=c.getItem(x))===null||y===void 0?void 0:y.type)!=="section"}).findIndex(x=>x===t.key)+1:t.index+1}let ut={role:"gridcell","aria-colindex":1};return{rowProps:{...F(re,w)},gridCellProps:ut,descriptionProps:{id:f},...V}}function ue(n){let e=null,r=null;do r=n.lastChild(),r&&(e=r);while(r);return e}const ye=new WeakMap;function rr(n,e,r){let{direction:a}=ge(),o=n.keyboardDelegate||new Ot({collection:e.collection,ref:r,orientation:"horizontal",direction:a,disabledKeys:e.disabledKeys,disabledBehavior:e.selectionManager.disabledBehavior}),{labelProps:t,fieldProps:i,descriptionProps:s,errorMessageProps:l}=Wt({...n,labelElementType:"span"}),{gridProps:p}=er({...n,...i,keyboardDelegate:o,shouldFocusWrap:!0,linkBehavior:"override",keyboardNavigationBehavior:"tab"},e,r),[u,m]=b.useState(!1),{focusWithinProps:f}=It({onFocusWithinChange:m}),g=q(n),v=b.useRef(e.collection.size);return b.useEffect(()=>{r.current&&v.current>0&&e.collection.size===0&&u&&r.current.focus(),v.current=e.collection.size},[e.collection.size,u,r]),ye.set(e,{onRemove:n.onRemove}),{gridProps:F(p,g,{role:e.collection.size?"grid":"group","aria-atomic":!1,"aria-relevant":"additions","aria-live":u?"polite":"off",...f,...i}),labelProps:t,descriptionProps:s,errorMessageProps:l}}var xe={};xe={removeButtonLabel:"إزالة",removeDescription:"اضغط على مفتاح DELETE لإزالة علامة."};var he={};he={removeButtonLabel:"Премахване",removeDescription:"Натиснете Delete, за да премахнете маркера."};var De={};De={removeButtonLabel:"Odebrat",removeDescription:"Stisknutím klávesy Delete odeberete značku."};var Te={};Te={removeButtonLabel:"Fjern",removeDescription:"Tryk på Slet for at fjerne tag."};var Se={};Se={removeButtonLabel:"Entfernen",removeDescription:"Auf „Löschen“ drücken, um das Tag zu entfernen."};var ke={};ke={removeButtonLabel:"Κατάργηση",removeDescription:"Πατήστε Διαγραφή για να καταργήσετε την ετικέτα."};var Be={};Be={removeDescription:"Press Delete to remove tag.",removeButtonLabel:"Remove"};var Pe={};Pe={removeButtonLabel:"Quitar",removeDescription:"Pulse Eliminar para quitar la etiqueta."};var Le={};Le={removeButtonLabel:"Eemalda",removeDescription:"Sildi eemaldamiseks vajutage kustutusklahvi Delete."};var Ee={};Ee={removeButtonLabel:"Poista",removeDescription:"Poista tunniste painamalla Poista-painiketta."};var we={};we={removeButtonLabel:"Supprimer",removeDescription:"Appuyez sur Supprimer pour supprimer l’étiquette."};var Ce={};Ce={removeButtonLabel:"הסר",removeDescription:"לחץ על מחק כדי להסיר תג."};var Ke={};Ke={removeButtonLabel:"Ukloni",removeDescription:"Pritisnite Delete za uklanjanje oznake."};var Ae={};Ae={removeButtonLabel:"Eltávolítás",removeDescription:"Nyomja meg a Delete billentyűt a címke eltávolításához."};var Me={};Me={removeButtonLabel:"Rimuovi",removeDescription:"Premi Elimina per rimuovere il tag."};var Ge={};Ge={removeButtonLabel:"削除",removeDescription:"タグを削除するには、Delete キーを押します。"};var Ie={};Ie={removeButtonLabel:"제거",removeDescription:"태그를 제거하려면 Delete 키를 누르십시오."};var Re={};Re={removeButtonLabel:"Pašalinti",removeDescription:"Norėdami pašalinti žymą, paspauskite „Delete“ klavišą."};var je={};je={removeButtonLabel:"Noņemt",removeDescription:"Nospiediet Delete [Dzēst], lai noņemtu tagu."};var ze={};ze={removeButtonLabel:"Fjern",removeDescription:"Trykk på Slett for å fjerne taggen."};var Ne={};Ne={removeButtonLabel:"Verwijderen",removeDescription:"Druk op Verwijderen om de tag te verwijderen."};var Fe={};Fe={removeButtonLabel:"Usuń",removeDescription:"Naciśnij Usuń, aby usunąć znacznik."};var Oe={};Oe={removeButtonLabel:"Remover",removeDescription:"Pressione Delete para remover a tag."};var We={};We={removeButtonLabel:"Eliminar",removeDescription:"Prima Delete para eliminar a tag."};var Ue={};Ue={removeButtonLabel:"Îndepărtaţi",removeDescription:"Apăsați pe Delete (Ștergere) pentru a elimina eticheta."};var Ve={};Ve={removeButtonLabel:"Удалить",removeDescription:"Нажмите DELETE, чтобы удалить тег."};var _e={};_e={removeButtonLabel:"Odstrániť",removeDescription:"Ak chcete odstrániť značku, stlačte kláves Delete."};var He={};He={removeButtonLabel:"Odstrani",removeDescription:"Pritisnite Delete, da odstranite oznako."};var qe={};qe={removeButtonLabel:"Ukloni",removeDescription:"Pritisnite Obriši da biste uklonili oznaku."};var Je={};Je={removeButtonLabel:"Ta bort",removeDescription:"Tryck på Radera för att ta bort taggen."};var Xe={};Xe={removeButtonLabel:"Kaldır",removeDescription:"Etiketi kaldırmak için Sil tuşuna basın."};var Ye={};Ye={removeButtonLabel:"Вилучити",removeDescription:"Натисніть Delete, щоб вилучити тег."};var Qe={};Qe={removeButtonLabel:"删除",removeDescription:"按下“删除”以删除标记。"};var Ze={};Ze={removeButtonLabel:"移除",removeDescription:"按 Delete 鍵以移除標記。"};var et={};et={"ar-AE":xe,"bg-BG":he,"cs-CZ":De,"da-DK":Te,"de-DE":Se,"el-GR":ke,"en-US":Be,"es-ES":Pe,"et-EE":Le,"fi-FI":Ee,"fr-FR":we,"he-IL":Ce,"hr-HR":Ke,"hu-HU":Ae,"it-IT":Me,"ja-JP":Ge,"ko-KR":Ie,"lt-LT":Re,"lv-LV":je,"nb-NO":ze,"nl-NL":Ne,"pl-PL":Fe,"pt-BR":Oe,"pt-PT":We,"ro-RO":Ue,"ru-RU":Ve,"sk-SK":_e,"sl-SI":He,"sr-SP":qe,"sv-SE":Je,"tr-TR":Xe,"uk-UA":Ye,"zh-CN":Qe,"zh-TW":Ze};function nr(n){return n&&n.__esModule?n.default:n}function ir(n,e,r){let{item:a}=n,o=Vt(nr(et),"@react-aria/tag"),t=fe(),{onRemove:i}=ye.get(e)||{},{rowProps:s,gridCellProps:l,...p}=tr({node:a},e,r),{descriptionProps:u,...m}=p,f=e.disabledKeys.has(a.key)||a.props.isDisabled,g=V=>{if(V.key==="Delete"||V.key==="Backspace"){if(f)return;V.preventDefault(),e.selectionManager.isSelected(a.key)?i?.(new Set(e.selectionManager.selectedKeys)):i?.(new Set([a.key]))}},v=Mt();v==="virtual"&&typeof window<"u"&&"ontouchstart"in window&&(v="pointer");let w=i&&(v==="keyboard"||v==="virtual")?o.format("removeDescription"):"",D=vt(w),P=a.key===e.selectionManager.focusedKey,O=e.selectionManager.focusedKey!=null,L=-1;!f&&(P||!O)&&(L=0);let C=q(a.props),U=ve(a.props),{focusableProps:Z}=Gt({isDisabled:f},r);return{removeButtonProps:{"aria-label":o.format("removeButtonLabel"),"aria-labelledby":`${t} ${s.id}`,isDisabled:f,id:t,onPress:()=>i?i(new Set([a.key])):null},rowProps:F(Z,s,C,U,{tabIndex:L,onKeyDown:i?g:void 0,"aria-describedby":D["aria-describedby"]}),gridCellProps:F(l,{"aria-errormessage":n["aria-errormessage"],"aria-label":n["aria-label"]}),...m,allowsRemoving:!!i}}function tt(n){let{initialItems:e=[],initialSelectedKeys:r,getKey:a=p=>{var u;return(u=p.id)!==null&&u!==void 0?u:p.key},filter:o,initialFilterText:t=""}=n,[i,s]=b.useState({items:e,selectedKeys:r==="all"?"all":new Set(r||[]),filterText:t}),l=b.useMemo(()=>o?i.items.filter(p=>o(p,i.filterText)):i.items,[i.items,i.filterText,o]);return{...i,items:l,...ar({getKey:a},s),getItem(p){return i.items.find(u=>a(u)===p)}}}function ar(n,e){let{cursor:r,getKey:a}=n;return{setSelectedKeys(o){e(t=>({...t,selectedKeys:o}))},addKeysToSelection(o){e(t=>t.selectedKeys==="all"?t:o==="all"?{...t,selectedKeys:"all"}:{...t,selectedKeys:new Set([...t.selectedKeys,...o])})},removeKeysFromSelection(o){e(t=>{if(o==="all")return{...t,selectedKeys:new Set};let i=t.selectedKeys==="all"?new Set(t.items.map(a)):new Set(t.selectedKeys);for(let s of o)i.delete(s);return{...t,selectedKeys:i}})},setFilterText(o){e(t=>({...t,filterText:o}))},insert(o,...t){e(i=>J(i,o,...t))},insertBefore(o,...t){e(i=>{let s=i.items.findIndex(l=>a?.(l)===o);if(s===-1)if(i.items.length===0)s=0;else return i;return J(i,s,...t)})},insertAfter(o,...t){e(i=>{let s=i.items.findIndex(l=>a?.(l)===o);if(s===-1)if(i.items.length===0)s=0;else return i;return J(i,s+1,...t)})},prepend(...o){e(t=>J(t,0,...o))},append(...o){e(t=>J(t,t.items.length,...o))},remove(...o){e(t=>{let i=new Set(o),s=t.items.filter(p=>!i.has(a(p))),l="all";if(t.selectedKeys!=="all"){l=new Set(t.selectedKeys);for(let p of o)l.delete(p)}return r==null&&s.length===0&&(l=new Set),{...t,items:s,selectedKeys:l}})},removeSelectedItems(){e(o=>{if(o.selectedKeys==="all")return{...o,items:[],selectedKeys:new Set};let t=o.selectedKeys,i=o.items.filter(s=>!t.has(a(s)));return{...o,items:i,selectedKeys:new Set}})},move(o,t){e(i=>{let s=i.items.findIndex(u=>a(u)===o);if(s===-1)return i;let l=i.items.slice(),[p]=l.splice(s,1);return l.splice(t,0,p),{...i,items:l}})},moveBefore(o,t){e(i=>{let s=i.items.findIndex(u=>a(u)===o);if(s===-1)return i;let p=(Array.isArray(t)?t:[...t]).map(u=>i.items.findIndex(m=>a(m)===u)).sort((u,m)=>u-m);return ce(i,p,s)})},moveAfter(o,t){e(i=>{let s=i.items.findIndex(u=>a(u)===o);if(s===-1)return i;let p=(Array.isArray(t)?t:[...t]).map(u=>i.items.findIndex(m=>a(m)===u)).sort((u,m)=>u-m);return ce(i,p,s+1)})},update(o,t){e(i=>{let s=i.items.findIndex(l=>a(l)===o);return s===-1?i:{...i,items:[...i.items.slice(0,s),t,...i.items.slice(s+1)]}})}}}function J(n,e,...r){return{...n,items:[...n.items.slice(0,e),...r,...n.items.slice(e)]}}function ce(n,e,r){r-=e.filter(t=>t<r).length;let a=e.map(t=>({from:t,to:r++}));for(let t=0;t<a.length;t++){let i=a[t].from;for(let s=t;s<a.length;s++)a[s].from>i&&a[s].from--}for(let t=0;t<a.length;t++){let i=a[t];for(let s=a.length-1;s>t;s--){let l=a[s];l.from<i.to?i.to++:l.from++}}let o=n.items.slice();for(let t of a){let[i]=o.splice(t.from,1);o.splice(t.to,0,i)}return{...n,items:o}}const or=b.createContext(null),rt=b.createContext(null),sr=b.forwardRef(function(e,r){return[e,r]=ee(e,r,or),h.createElement(Q.Provider,{value:null},h.createElement(yt,{content:e.children},a=>h.createElement(lr,{props:e,forwardedRef:r,collection:a})))});function lr({props:n,forwardedRef:e,collection:r}){let a=b.useRef(null),{id:o,...t}=n;[t,a]=ee(t,a,Bt);let{filter:i,shouldUseVirtualFocus:s,...l}=t,[p,u]=St(!n["aria-label"]&&!n["aria-labelledby"]),m=_t({...l,children:void 0,collection:r}),f=Ht(m,i),g=q(t,{global:!0}),v=Object.fromEntries(Object.entries(g).map(([C,U])=>[C,C==="id"?U:void 0])),{gridProps:w,labelProps:D,descriptionProps:P,errorMessageProps:O}=rr({...l,...v,label:u},f,a);var L;return h.createElement("div",{...g,id:o,ref:e,slot:n.slot||void 0,className:(L=n.className)!==null&&L!==void 0?L:"react-aria-TagGroup",style:n.style},h.createElement(me,{values:[[kt,{...D,elementType:"span",ref:p}],[rt,{...w,ref:a}],[Q,f],[Et,{slots:{description:P,errorMessage:O}}]]},n.children))}const ur=b.forwardRef(function(e,r){return b.useContext(Q)?h.createElement(cr,{props:e,forwardedRef:r}):h.createElement(xt,e)});function cr({props:n,forwardedRef:e}){let r=b.useContext(Q),{CollectionRoot:a}=b.useContext(de),[o,t]=ee({},e,rt),{focusProps:i,isFocused:s,isFocusVisible:l}=be(),p={isEmpty:r.collection.size===0,isFocused:s,isFocusVisible:l,state:r},u=pe({className:n.className,style:n.style,defaultClassName:"react-aria-TagList",values:p}),m=Tt(r.selectionManager.focusedKey),f=q(n,{global:!0});return h.createElement("div",{...F(f,u,o,i),ref:t,"data-empty":r.collection.size===0||void 0,"data-focused":s||void 0,"data-focus-visible":l||void 0},h.createElement(Lt,null,r.collection.size===0&&n.renderEmptyState?n.renderEmptyState(p):h.createElement(a,{collection:r.collection,persistedKeys:m})))}const dr=$t(ht,(n,e,r)=>{let a=b.useContext(Q),o=Kt(e),{focusProps:t,isFocusVisible:i}=be({within:!1}),{rowProps:s,gridCellProps:l,removeButtonProps:p,...u}=ir({item:r},a,o),{hoverProps:m,isHovered:f}=Rt({isDisabled:!u.allowsSelection,onHoverStart:r.props.onHoverStart,onHoverChange:r.props.onHoverChange,onHoverEnd:r.props.onHoverEnd}),g=pe({...n,id:void 0,children:r.rendered,defaultClassName:"react-aria-Tag",values:{...u,isFocusVisible:i,isHovered:f,selectionMode:a.selectionManager.selectionMode,selectionBehavior:a.selectionManager.selectionBehavior}});b.useEffect(()=>{r.textValue},[r.textValue]);let v=q(n,{global:!0});return delete v.id,delete v.onClick,h.createElement("div",{ref:o,...F(v,g,s,t,m),"data-selected":u.isSelected||void 0,"data-disabled":u.isDisabled||void 0,"data-hovered":f||void 0,"data-focused":u.isFocused||void 0,"data-focus-visible":i||void 0,"data-pressed":u.isPressed||void 0,"data-allows-removing":u.allowsRemoving||void 0,"data-selection-mode":a.selectionManager.selectionMode==="none"?void 0:a.selectionManager.selectionMode},h.createElement("div",{...l,style:{display:"contents"}},h.createElement(me,{values:[[ft,{slots:{remove:p}}],[de,Dt],[Pt,{isSelected:u.isSelected}]]},g.children)))}),nt={classNames:{group:"bui-TagGroup",list:"bui-TagList",tag:"bui-Tag",tagIcon:"bui-TagIcon",tagRemoveButton:"bui-TagRemoveButton"}},Y={"bui-TagList":"_bui-TagList_1kpft_20","bui-Tag":"_bui-Tag_1kpft_20","bui-TagRemoveButton":"_bui-TagRemoveButton_1kpft_72","bui-TagIcon":"_bui-TagIcon_1kpft_83"},S=n=>{const{classNames:e,cleanedProps:r}=$e(nt,n),{items:a,children:o,renderEmptyState:t,...i}=r;return d.jsx(sr,{className:X(e.group,Y[e.group]),...i,children:d.jsx(ur,{className:X(e.list,Y[e.list]),items:a,renderEmptyState:t,children:o})})},k=n=>{const{classNames:e,cleanedProps:r}=$e(nt,{size:"small",...n}),{children:a,className:o,icon:t,size:i,href:s,...l}=r,p=typeof a=="string"?a:void 0,u=Jt(),m=s!==void 0,f=qt(s),g=d.jsx(dr,{textValue:p,className:X(e.tag,Y[e.tag],o),"data-size":i,href:s,...l,children:({allowsRemoving:v})=>d.jsxs(d.Fragment,{children:[t&&d.jsx("span",{className:X(e.tagIcon,Y[e.tagIcon]),children:t}),a,v&&d.jsx(bt,{className:X(e.tagRemoveButton,Y[e.tagRemoveButton]),slot:"remove",children:d.jsx(pt,{size:16})})]})});return m&&!f?d.jsx(Ut,{navigate:u,useHref:Xt,children:g}):g};S.__docgenInfo={description:`A component that renders a list of tags.

@public`,methods:[],displayName:"TagGroup",composes:["Omit","Pick"]};k.__docgenInfo={description:`A component that renders a tag.

@public`,methods:[],displayName:"Tag",props:{icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The icon to display in the chip."},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},description:"The size of the chip."}},composes:["ReactAriaTagProps"]};const E=dt.meta({title:"Backstage UI/TagGroup",component:S,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[n=>d.jsx(Yt,{children:d.jsx(n,{})})]}),B=[{id:"banana",name:"Banana",icon:d.jsx(ne,{})},{id:"apple",name:"Apple",icon:d.jsx(mt,{}),isDisabled:!0},{id:"orange",name:"Orange",icon:d.jsx(ie,{}),isDisabled:!0},{id:"pear",name:"Pear",icon:d.jsx(ae,{})},{id:"grape",name:"Grape",icon:d.jsx(ne,{})},{id:"pineapple",name:"Pineapple",icon:d.jsx(ie,{})},{id:"strawberry",name:"Strawberry",icon:d.jsx(ae,{})}],T=E.story({args:{"aria-label":"Tag Group"},render:n=>d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{children:e.name},e.id))})}),A=E.story({args:{...T.input.args},render:n=>d.jsxs(Qt,{direction:"column",children:[d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{size:"small",icon:e.icon,children:e.name},e.id))}),d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{size:"medium",icon:e.icon,children:e.name},e.id))})]})}),M=E.story({args:{selectionMode:"single","aria-label":"Tag Group"},render:n=>{const[e,r]=b.useState(new Set(["travel"]));return d.jsx(S,{...n,items:B,selectedKeys:e,onSelectionChange:r,children:a=>d.jsx(k,{children:a.name})})}}),G=E.story({args:{selectionMode:"multiple","aria-label":"Tag Group"},render:n=>{const[e,r]=b.useState(new Set(["travel","shopping"]));return d.jsx(S,{...n,items:B,selectedKeys:e,onSelectionChange:r,children:a=>d.jsx(k,{children:a.name})})}}),I=E.story({args:{...T.input.args},render:n=>d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{icon:e.icon?e.icon:void 0,children:e.name},e.id))})}),R=E.story({render:n=>d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{href:`/items/${e.id}`,children:e.name},e.id))})}),j=E.story({render:n=>d.jsx(S,{...n,children:B.map(e=>d.jsx(k,{isDisabled:e.isDisabled,children:e.name},e.id))})}),z=E.story({args:{...T.input.args},render:n=>{const[e,r]=b.useState(new Set(["travel"])),a=tt({initialItems:B});return d.jsx(S,{...n,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:r,children:o=>d.jsx(k,{children:o.name})})}}),N=E.story({args:{...T.input.args},render:n=>{const[e,r]=b.useState(new Set(["travel"])),a=tt({initialItems:B});return d.jsx(S,{...n,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:r,children:o=>d.jsx(k,{icon:o.icon?o.icon:void 0,children:o.name})})}});T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{code:`const Default = () => (
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
`,...A.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{code:`const SelectionModeSingle = () => {
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
`,...M.input.parameters?.docs?.source}}};G.input.parameters={...G.input.parameters,docs:{...G.input.parameters?.docs,source:{code:`const SelectionModeMultiple = () => {
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
`,...G.input.parameters?.docs?.source}}};I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{code:`const WithIcon = () => (
  <TagGroup>
    {initialList.map((item) => (
      <Tag key={item.id} icon={item.icon ? item.icon : undefined}>
        {item.name}
      </Tag>
    ))}
  </TagGroup>
);
`,...I.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{code:`const WithLink = () => (
  <TagGroup>
    {initialList.map((item) => (
      <Tag key={item.id} href={\`/items/\${item.id}\`}>
        {item.name}
      </Tag>
    ))}
  </TagGroup>
);
`,...R.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{code:`const Disabled = () => (
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
})`,...A.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...M.input.parameters?.docs?.source}}};G.input.parameters={...G.input.parameters,docs:{...G.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...G.input.parameters?.docs?.source}}};I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} icon={item.icon ? item.icon : undefined}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...I.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id} href={\`/items/\${item.id}\`}>
          {item.name}
        </Tag>)}
    </TagGroup>
})`,...R.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...N.input.parameters?.docs?.source}}};const _r=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{T as Default,j as Disabled,z as RemovingTags,G as SelectionModeMultiple,M as SelectionModeSingle,A as Sizes,I as WithIcon,N as WithIconAndRemoveButton,R as WithLink,_r as __namedExportsOrder};
