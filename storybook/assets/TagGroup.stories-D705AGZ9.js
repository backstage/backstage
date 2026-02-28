import{r as f,R as T,ap as ce,am as ue,j as d,p as ut}from"./iframe-BplO06yy.js";import{A as dt,n as te,o as pt,d as re,g as ie}from"./index-Bt40hWBe.js";import{c as mt,$ as ft}from"./Button-CU1VF19G.js";import{$ as Q,a as de,e as pe,c as bt}from"./utils-B0YpRa1z.js";import{e as gt,D as _,u as vt,f as $t,g as yt,h as xt,i as Tt,j as me,s as ht,r as Dt}from"./SelectionManager-YA7JRN7E.js";import{$ as St}from"./Label-CkXKdi9n.js";import{c as Y}from"./ListBox-ogV08Bvb.js";import{c as kt}from"./RSPContexts-CqYemlPD.js";import{$ as ne,a as Bt,c as Pt}from"./SelectionIndicator-z1Dzpd-X.js";import{a as Lt}from"./Text-BtVl-LMp.js";import{a as fe,$ as F,c as wt,f as Et,d as Ct}from"./useObjectRef-B7mDhX4O.js";import{a as H,P as be,x as W,o as At,N as Kt,$ as Rt}from"./useFocusable-C9lIVari.js";import{b as Mt,a as ge,$ as Gt}from"./useFocusRing-yxqdftYt.js";import{$ as It,a as jt}from"./useHighlightSelectionDescription-BrdaMiRL.js";import{$ as Nt}from"./useHasTabbableChild-CS5-20kc.js";import{a as zt,$ as q,d as Ft}from"./Separator-Bqo-iGpm.js";import{$ as Ot}from"./useField-CCN3K9HO.js";import{$ as ve}from"./context-CpyNrLMJ.js";import{$ as Wt}from"./useLocalizedStringFormatter-BDcqPubX.js";import{a as Ut,$ as Vt}from"./useListState-D4wzo7QY.js";import{c as _t}from"./InternalLinkProvider-D_eDs7St.js";import{M as qt}from"./index-BquTymTZ.js";import{F as Ht}from"./Flex-DtEel8x3.js";import"./preload-helper-PPVm8Dsz.js";import"./useLabel-C4CdtIJm.js";import"./useLabels-DzFtgpw9.js";import"./Hidden-JxKi7FVV.js";import"./useButton-CnY7e4-p.js";import"./usePress-Burh2Y4c.js";import"./useEvent-BZSx1CUA.js";import"./useControlledState-CfLiThbX.js";const Z=new WeakMap;function ae(i,e){var r;let{id:a}=(r=Z.get(i))!==null&&r!==void 0?r:{};if(!a)throw new Error("Unknown list");return`${a}-${Xt(e)}`}function Xt(i){return typeof i=="string"?i.replace(/\s*/g,""):""+i}function Yt(i,e,r){let{isVirtualized:a,keyboardDelegate:o,layoutDelegate:t,onAction:n,disallowTypeAhead:s,linkBehavior:l="action",keyboardNavigationBehavior:p="arrow",escapeKeyBehavior:c="clearSelection",shouldSelectOnPressUp:m}=i;!i["aria-label"]&&!i["aria-labelledby"]&&console.warn("An aria-label or aria-labelledby prop is required for accessibility.");let{listProps:b}=zt({selectionManager:e.selectionManager,collection:e.collection,disabledKeys:e.disabledKeys,ref:r,keyboardDelegate:o,layoutDelegate:t,isVirtualized:a,selectOnFocus:e.selectionManager.selectionBehavior==="replace",shouldFocusWrap:i.shouldFocusWrap,linkBehavior:l,disallowTypeAhead:s,autoFocus:i.autoFocus,escapeKeyBehavior:c}),y=fe(i.id);Z.set(e,{id:y,onAction:n,linkBehavior:l,keyboardNavigationBehavior:p,shouldSelectOnPressUp:m});let g=It({selectionManager:e.selectionManager,hasItemActions:!!n}),E=Nt(r,{isDisabled:e.collection.size!==0}),h=H(i,{labelable:!0}),P=F(h,{role:"grid",id:y,"aria-multiselectable":e.selectionManager.selectionMode==="multiple"?"true":void 0},e.collection.size===0?{tabIndex:E?-1:0}:b,g);return a&&(P["aria-rowcount"]=e.collection.size,P["aria-colcount"]=1),jt({},e),{gridProps:P}}const oe={expand:{ltr:"ArrowRight",rtl:"ArrowLeft"},collapse:{ltr:"ArrowLeft",rtl:"ArrowRight"}};function Jt(i,e,r){var a,o;let{node:t,isVirtualized:n}=i,{direction:s}=ve(),{onAction:l,linkBehavior:p,keyboardNavigationBehavior:c,shouldSelectOnPressUp:m}=Z.get(e),b=wt(),y=f.useRef(null),g=()=>{var u;r.current!==null&&(y.current!=null&&t.key!==y.current||!(!((u=r.current)===null||u===void 0)&&u.contains(document.activeElement)))&&W(r.current)},E={},h=i.hasChildItems,P=e.selectionManager.isLink(t.key);if(t!=null&&"expandedKeys"in e){var O,L;let u=(O=(L=e.collection).getChildren)===null||O===void 0?void 0:O.call(L,t.key);h=h||[...u??[]].length>1,l==null&&!P&&e.selectionManager.selectionMode==="none"&&h&&(l=()=>e.toggleKey(t.key));let v=h?e.expandedKeys.has(t.key):void 0,x=1;if(t.level>0&&t?.parentKey!=null){let $=e.collection.getItem(t.parentKey);if($){var C,U;x=[...(C=(U=e.collection).getChildren)===null||C===void 0?void 0:C.call(U,$.key)].filter(ct=>ct.type==="item").length}}else x=[...e.collection].filter($=>$.level===0&&$.type==="item").length;E={"aria-expanded":v,"aria-level":t.level+1,"aria-posinset":t?.index+1,"aria-setsize":x}}let{itemProps:J,...V}=gt({selectionManager:e.selectionManager,key:t.key,ref:r,isVirtualized:n,shouldSelectOnPressUp:i.shouldSelectOnPressUp||m,onAction:l||!((a=t.props)===null||a===void 0)&&a.onAction?Et((o=t.props)===null||o===void 0?void 0:o.onAction,l?()=>l(t.key):void 0):void 0,focus:g,linkBehavior:p}),it=u=>{if(!u.currentTarget.contains(u.target)||!r.current||!document.activeElement)return;let v=ne(r.current);if(v.currentNode=document.activeElement,"expandedKeys"in e&&document.activeElement===r.current){if(u.key===oe.expand[s]&&e.selectionManager.focusedKey===t.key&&h&&!e.expandedKeys.has(t.key)){e.toggleKey(t.key),u.stopPropagation();return}else if(u.key===oe.collapse[s]&&e.selectionManager.focusedKey===t.key&&h&&e.expandedKeys.has(t.key)){e.toggleKey(t.key),u.stopPropagation();return}}switch(u.key){case"ArrowLeft":if(c==="arrow"){let $=s==="rtl"?v.nextNode():v.previousNode();if($)u.preventDefault(),u.stopPropagation(),W($),_($,{containingElement:q(r.current)});else if(u.preventDefault(),u.stopPropagation(),s==="rtl")W(r.current),_(r.current,{containingElement:q(r.current)});else{v.currentNode=r.current;let A=se(v);A&&(W(A),_(A,{containingElement:q(r.current)}))}}break;case"ArrowRight":if(c==="arrow"){let $=s==="rtl"?v.previousNode():v.nextNode();if($)u.preventDefault(),u.stopPropagation(),W($),_($,{containingElement:q(r.current)});else if(u.preventDefault(),u.stopPropagation(),s==="ltr")W(r.current),_(r.current,{containingElement:q(r.current)});else{v.currentNode=r.current;let A=se(v);A&&(W(A),_(A,{containingElement:q(r.current)}))}}break;case"ArrowUp":case"ArrowDown":if(!u.altKey&&r.current.contains(u.target)){var x;u.stopPropagation(),u.preventDefault(),(x=r.current.parentElement)===null||x===void 0||x.dispatchEvent(new KeyboardEvent(u.nativeEvent.type,u.nativeEvent))}break}},nt=u=>{if(y.current=t.key,u.target!==r.current){At()||e.selectionManager.setFocusedKey(t.key);return}},at=u=>{if(!(!u.currentTarget.contains(u.target)||!r.current||!document.activeElement))switch(u.key){case"Tab":if(c==="tab"){let v=ne(r.current,{tabbable:!0});v.currentNode=document.activeElement,(u.shiftKey?v.previousNode():v.nextNode())&&u.stopPropagation()}}},ot=be(t.props),st=V.hasAction?ot:{},ee=F(J,st,{role:"row",onKeyDownCapture:it,onKeyDown:at,onFocus:nt,"aria-label":t["aria-label"]||t.textValue||void 0,"aria-selected":e.selectionManager.canSelectItem(t.key)?e.selectionManager.isSelected(t.key):void 0,"aria-disabled":e.selectionManager.isDisabled(t.key)||void 0,"aria-labelledby":b&&(t["aria-label"]||t.textValue)?`${ae(e,t.key)} ${b}`:void 0,id:ae(e,t.key)});if(n){let{collection:u}=e,v=[...u];ee["aria-rowindex"]=v.find(x=>x.type==="section")?[...u.getKeys()].filter(x=>{var $;return(($=u.getItem(x))===null||$===void 0?void 0:$.type)!=="section"}).findIndex(x=>x===t.key)+1:t.index+1}let lt={role:"gridcell","aria-colindex":1};return{rowProps:{...F(ee,E)},gridCellProps:lt,descriptionProps:{id:b},...V}}function se(i){let e=null,r=null;do r=i.lastChild(),r&&(e=r);while(r);return e}const $e=new WeakMap;function Qt(i,e,r){let{direction:a}=ve(),o=i.keyboardDelegate||new Ft({collection:e.collection,ref:r,orientation:"horizontal",direction:a,disabledKeys:e.disabledKeys,disabledBehavior:e.selectionManager.disabledBehavior}),{labelProps:t,fieldProps:n,descriptionProps:s,errorMessageProps:l}=Ot({...i,labelElementType:"span"}),{gridProps:p}=Yt({...i,...n,keyboardDelegate:o,shouldFocusWrap:!0,linkBehavior:"override",keyboardNavigationBehavior:"tab"},e,r),[c,m]=f.useState(!1),{focusWithinProps:b}=Mt({onFocusWithinChange:m}),y=H(i),g=f.useRef(e.collection.size);return f.useEffect(()=>{r.current&&g.current>0&&e.collection.size===0&&c&&r.current.focus(),g.current=e.collection.size},[e.collection.size,c,r]),$e.set(e,{onRemove:i.onRemove}),{gridProps:F(p,y,{role:e.collection.size?"grid":"group","aria-atomic":!1,"aria-relevant":"additions","aria-live":c?"polite":"off",...b,...n}),labelProps:t,descriptionProps:s,errorMessageProps:l}}var ye={};ye={removeButtonLabel:"إزالة",removeDescription:"اضغط على مفتاح DELETE لإزالة علامة."};var xe={};xe={removeButtonLabel:"Премахване",removeDescription:"Натиснете Delete, за да премахнете маркера."};var Te={};Te={removeButtonLabel:"Odebrat",removeDescription:"Stisknutím klávesy Delete odeberete značku."};var he={};he={removeButtonLabel:"Fjern",removeDescription:"Tryk på Slet for at fjerne tag."};var De={};De={removeButtonLabel:"Entfernen",removeDescription:"Auf „Löschen“ drücken, um das Tag zu entfernen."};var Se={};Se={removeButtonLabel:"Κατάργηση",removeDescription:"Πατήστε Διαγραφή για να καταργήσετε την ετικέτα."};var ke={};ke={removeDescription:"Press Delete to remove tag.",removeButtonLabel:"Remove"};var Be={};Be={removeButtonLabel:"Quitar",removeDescription:"Pulse Eliminar para quitar la etiqueta."};var Pe={};Pe={removeButtonLabel:"Eemalda",removeDescription:"Sildi eemaldamiseks vajutage kustutusklahvi Delete."};var Le={};Le={removeButtonLabel:"Poista",removeDescription:"Poista tunniste painamalla Poista-painiketta."};var we={};we={removeButtonLabel:"Supprimer",removeDescription:"Appuyez sur Supprimer pour supprimer l’étiquette."};var Ee={};Ee={removeButtonLabel:"הסר",removeDescription:"לחץ על מחק כדי להסיר תג."};var Ce={};Ce={removeButtonLabel:"Ukloni",removeDescription:"Pritisnite Delete za uklanjanje oznake."};var Ae={};Ae={removeButtonLabel:"Eltávolítás",removeDescription:"Nyomja meg a Delete billentyűt a címke eltávolításához."};var Ke={};Ke={removeButtonLabel:"Rimuovi",removeDescription:"Premi Elimina per rimuovere il tag."};var Re={};Re={removeButtonLabel:"削除",removeDescription:"タグを削除するには、Delete キーを押します。"};var Me={};Me={removeButtonLabel:"제거",removeDescription:"태그를 제거하려면 Delete 키를 누르십시오."};var Ge={};Ge={removeButtonLabel:"Pašalinti",removeDescription:"Norėdami pašalinti žymą, paspauskite „Delete“ klavišą."};var Ie={};Ie={removeButtonLabel:"Noņemt",removeDescription:"Nospiediet Delete [Dzēst], lai noņemtu tagu."};var je={};je={removeButtonLabel:"Fjern",removeDescription:"Trykk på Slett for å fjerne taggen."};var Ne={};Ne={removeButtonLabel:"Verwijderen",removeDescription:"Druk op Verwijderen om de tag te verwijderen."};var ze={};ze={removeButtonLabel:"Usuń",removeDescription:"Naciśnij Usuń, aby usunąć znacznik."};var Fe={};Fe={removeButtonLabel:"Remover",removeDescription:"Pressione Delete para remover a tag."};var Oe={};Oe={removeButtonLabel:"Eliminar",removeDescription:"Prima Delete para eliminar a tag."};var We={};We={removeButtonLabel:"Îndepărtaţi",removeDescription:"Apăsați pe Delete (Ștergere) pentru a elimina eticheta."};var Ue={};Ue={removeButtonLabel:"Удалить",removeDescription:"Нажмите DELETE, чтобы удалить тег."};var Ve={};Ve={removeButtonLabel:"Odstrániť",removeDescription:"Ak chcete odstrániť značku, stlačte kláves Delete."};var _e={};_e={removeButtonLabel:"Odstrani",removeDescription:"Pritisnite Delete, da odstranite oznako."};var qe={};qe={removeButtonLabel:"Ukloni",removeDescription:"Pritisnite Obriši da biste uklonili oznaku."};var He={};He={removeButtonLabel:"Ta bort",removeDescription:"Tryck på Radera för att ta bort taggen."};var Xe={};Xe={removeButtonLabel:"Kaldır",removeDescription:"Etiketi kaldırmak için Sil tuşuna basın."};var Ye={};Ye={removeButtonLabel:"Вилучити",removeDescription:"Натисніть Delete, щоб вилучити тег."};var Je={};Je={removeButtonLabel:"删除",removeDescription:"按下“删除”以删除标记。"};var Qe={};Qe={removeButtonLabel:"移除",removeDescription:"按 Delete 鍵以移除標記。"};var Ze={};Ze={"ar-AE":ye,"bg-BG":xe,"cs-CZ":Te,"da-DK":he,"de-DE":De,"el-GR":Se,"en-US":ke,"es-ES":Be,"et-EE":Pe,"fi-FI":Le,"fr-FR":we,"he-IL":Ee,"hr-HR":Ce,"hu-HU":Ae,"it-IT":Ke,"ja-JP":Re,"ko-KR":Me,"lt-LT":Ge,"lv-LV":Ie,"nb-NO":je,"nl-NL":Ne,"pl-PL":ze,"pt-BR":Fe,"pt-PT":Oe,"ro-RO":We,"ru-RU":Ue,"sk-SK":Ve,"sl-SI":_e,"sr-SP":qe,"sv-SE":He,"tr-TR":Xe,"uk-UA":Ye,"zh-CN":Je,"zh-TW":Qe};function Zt(i){return i&&i.__esModule?i.default:i}function er(i,e,r){let{item:a}=i,o=Wt(Zt(Ze),"@react-aria/tag"),t=fe(),{onRemove:n}=$e.get(e)||{},{rowProps:s,gridCellProps:l,...p}=Jt({node:a},e,r),{descriptionProps:c,...m}=p,b=e.disabledKeys.has(a.key)||a.props.isDisabled,y=V=>{if(V.key==="Delete"||V.key==="Backspace"){if(b)return;V.preventDefault(),e.selectionManager.isSelected(a.key)?n?.(new Set(e.selectionManager.selectedKeys)):n?.(new Set([a.key]))}},g=Kt();g==="virtual"&&typeof window<"u"&&"ontouchstart"in window&&(g="pointer");let E=n&&(g==="keyboard"||g==="virtual")?o.format("removeDescription"):"",h=vt(E),P=a.key===e.selectionManager.focusedKey,O=e.selectionManager.focusedKey!=null,L=-1;!b&&(P||!O)&&(L=0);let C=H(a.props),U=be(a.props),{focusableProps:J}=Rt({isDisabled:b},r);return{removeButtonProps:{"aria-label":o.format("removeButtonLabel"),"aria-labelledby":`${t} ${s.id}`,isDisabled:b,id:t,onPress:()=>n?n(new Set([a.key])):null},rowProps:F(J,s,C,U,{tabIndex:L,onKeyDown:n?y:void 0,"aria-describedby":h["aria-describedby"]}),gridCellProps:F(l,{"aria-errormessage":i["aria-errormessage"],"aria-label":i["aria-label"]}),...m,allowsRemoving:!!n}}function et(i){let{initialItems:e=[],initialSelectedKeys:r,getKey:a=p=>{var c;return(c=p.id)!==null&&c!==void 0?c:p.key},filter:o,initialFilterText:t=""}=i,[n,s]=f.useState({items:e,selectedKeys:r==="all"?"all":new Set(r||[]),filterText:t}),l=f.useMemo(()=>o?n.items.filter(p=>o(p,n.filterText)):n.items,[n.items,n.filterText,o]);return{...n,items:l,...tr({getKey:a},s),getItem(p){return n.items.find(c=>a(c)===p)}}}function tr(i,e){let{cursor:r,getKey:a}=i;return{setSelectedKeys(o){e(t=>({...t,selectedKeys:o}))},addKeysToSelection(o){e(t=>t.selectedKeys==="all"?t:o==="all"?{...t,selectedKeys:"all"}:{...t,selectedKeys:new Set([...t.selectedKeys,...o])})},removeKeysFromSelection(o){e(t=>{if(o==="all")return{...t,selectedKeys:new Set};let n=t.selectedKeys==="all"?new Set(t.items.map(a)):new Set(t.selectedKeys);for(let s of o)n.delete(s);return{...t,selectedKeys:n}})},setFilterText(o){e(t=>({...t,filterText:o}))},insert(o,...t){e(n=>X(n,o,...t))},insertBefore(o,...t){e(n=>{let s=n.items.findIndex(l=>a?.(l)===o);if(s===-1)if(n.items.length===0)s=0;else return n;return X(n,s,...t)})},insertAfter(o,...t){e(n=>{let s=n.items.findIndex(l=>a?.(l)===o);if(s===-1)if(n.items.length===0)s=0;else return n;return X(n,s+1,...t)})},prepend(...o){e(t=>X(t,0,...o))},append(...o){e(t=>X(t,t.items.length,...o))},remove(...o){e(t=>{let n=new Set(o),s=t.items.filter(p=>!n.has(a(p))),l="all";if(t.selectedKeys!=="all"){l=new Set(t.selectedKeys);for(let p of o)l.delete(p)}return r==null&&s.length===0&&(l=new Set),{...t,items:s,selectedKeys:l}})},removeSelectedItems(){e(o=>{if(o.selectedKeys==="all")return{...o,items:[],selectedKeys:new Set};let t=o.selectedKeys,n=o.items.filter(s=>!t.has(a(s)));return{...o,items:n,selectedKeys:new Set}})},move(o,t){e(n=>{let s=n.items.findIndex(c=>a(c)===o);if(s===-1)return n;let l=n.items.slice(),[p]=l.splice(s,1);return l.splice(t,0,p),{...n,items:l}})},moveBefore(o,t){e(n=>{let s=n.items.findIndex(c=>a(c)===o);if(s===-1)return n;let p=(Array.isArray(t)?t:[...t]).map(c=>n.items.findIndex(m=>a(m)===c)).sort((c,m)=>c-m);return le(n,p,s)})},moveAfter(o,t){e(n=>{let s=n.items.findIndex(c=>a(c)===o);if(s===-1)return n;let p=(Array.isArray(t)?t:[...t]).map(c=>n.items.findIndex(m=>a(m)===c)).sort((c,m)=>c-m);return le(n,p,s+1)})},update(o,t){e(n=>{let s=n.items.findIndex(p=>a(p)===o);if(s===-1)return n;let l;return typeof t=="function"?l=t(n.items[s]):l=t,{...n,items:[...n.items.slice(0,s),l,...n.items.slice(s+1)]}})}}}function X(i,e,...r){return{...i,items:[...i.items.slice(0,e),...r,...i.items.slice(e)]}}function le(i,e,r){r-=e.filter(t=>t<r).length;let a=e.map(t=>({from:t,to:r++}));for(let t=0;t<a.length;t++){let n=a[t].from;for(let s=t;s<a.length;s++)a[s].from>n&&a[s].from--}for(let t=0;t<a.length;t++){let n=a[t];for(let s=a.length-1;s>t;s--){let l=a[s];l.from<n.to?n.to++:l.from++}}let o=i.items.slice();for(let t of a){let[n]=o.splice(t.from,1);o.splice(t.to,0,n)}return{...i,items:o}}const rr=f.createContext(null),tt=f.createContext(null),ir=f.forwardRef(function(e,r){return[e,r]=Q(e,r,rr),T.createElement(Y.Provider,{value:null},T.createElement(yt,{content:e.children},a=>T.createElement(nr,{props:e,forwardedRef:r,collection:a})))});function nr({props:i,forwardedRef:e,collection:r}){let a=f.useRef(null),{id:o,...t}=i;[t,a]=Q(t,a,kt);let{filter:n,shouldUseVirtualFocus:s,...l}=t,[p,c]=bt(!i["aria-label"]&&!i["aria-labelledby"]),m=Ut({...l,children:void 0,collection:r}),b=Vt(m,n),y=H(t,{global:!0}),g=Object.fromEntries(Object.entries(y).map(([C,U])=>[C,C==="id"?U:void 0])),{gridProps:E,labelProps:h,descriptionProps:P,errorMessageProps:O}=Qt({...l,...g,label:c},b,a);var L;return T.createElement("div",{...y,id:o,ref:e,slot:i.slot||void 0,className:(L=i.className)!==null&&L!==void 0?L:"react-aria-TagGroup",style:i.style},T.createElement(pe,{values:[[St,{...h,elementType:"span",ref:p}],[tt,{...E,ref:a}],[Y,b],[Lt,{slots:{description:P,errorMessage:O}}]]},i.children))}const ar=f.forwardRef(function(e,r){return f.useContext(Y)?T.createElement(or,{props:e,forwardedRef:r}):T.createElement(xt,e)});function or({props:i,forwardedRef:e}){let r=f.useContext(Y),{CollectionRoot:a}=f.useContext(me),[o,t]=Q({},e,tt),{focusProps:n,isFocused:s,isFocusVisible:l}=ge(),p={isEmpty:r.collection.size===0,isFocused:s,isFocusVisible:l,state:r},c=de({className:i.className,style:i.style,defaultClassName:"react-aria-TagList",values:p}),m=Dt(r.selectionManager.focusedKey),b=H(i,{global:!0});return T.createElement("div",{...F(b,c,o,n),ref:t,"data-empty":r.collection.size===0||void 0,"data-focused":s||void 0,"data-focus-visible":l||void 0},T.createElement(Pt,null,r.collection.size===0&&i.renderEmptyState?i.renderEmptyState(p):T.createElement(a,{collection:r.collection,persistedKeys:m})))}const sr=$t(Tt,(i,e,r)=>{let a=f.useContext(Y),o=Ct(e),{focusProps:t,isFocusVisible:n}=ge({within:!1}),{rowProps:s,gridCellProps:l,removeButtonProps:p,...c}=er({item:r},a,o),{hoverProps:m,isHovered:b}=Gt({isDisabled:!c.allowsSelection,onHoverStart:r.props.onHoverStart,onHoverChange:r.props.onHoverChange,onHoverEnd:r.props.onHoverEnd}),y=de({...i,id:void 0,children:r.rendered,defaultClassName:"react-aria-Tag",values:{...c,isFocusVisible:n,isHovered:b,selectionMode:a.selectionManager.selectionMode,selectionBehavior:a.selectionManager.selectionBehavior}});f.useEffect(()=>{r.textValue},[r.textValue]);let g=H(i,{global:!0});return delete g.id,delete g.onClick,T.createElement("div",{ref:o,...F(g,y,s,t,m),"data-selected":c.isSelected||void 0,"data-disabled":c.isDisabled||void 0,"data-hovered":b||void 0,"data-focused":c.isFocused||void 0,"data-focus-visible":n||void 0,"data-pressed":c.isPressed||void 0,"data-allows-removing":c.allowsRemoving||void 0,"data-selection-mode":a.selectionManager.selectionMode==="none"?void 0:a.selectionManager.selectionMode},T.createElement("div",{...l,style:{display:"contents"}},T.createElement(pe,{values:[[mt,{slots:{remove:p}}],[me,ht],[Bt,{isSelected:c.isSelected}]]},y.children)))}),rt={"bui-TagList":"_bui-TagList_1i4x5_20","bui-Tag":"_bui-Tag_1i4x5_20","bui-TagRemoveButton":"_bui-TagRemoveButton_1i4x5_72","bui-TagIcon":"_bui-TagIcon_1i4x5_83"},lr=ce()({styles:rt,classNames:{root:"bui-TagGroup",list:"bui-TagList"},propDefs:{items:{},children:{},renderEmptyState:{},className:{}}}),cr=ce()({styles:rt,classNames:{root:"bui-Tag",icon:"bui-TagIcon",removeButton:"bui-TagRemoveButton"},propDefs:{icon:{},size:{dataAttribute:!0,default:"small"},href:{},children:{},className:{}}}),{RoutingProvider:ur,useRoutingRegistrationEffect:dr}=_t(),S=i=>{const{ownProps:e,restProps:r}=ue(lr,i),{classes:a,items:o,children:t,renderEmptyState:n}=e;return d.jsx(ur,{children:d.jsx(ir,{className:a.root,...r,children:d.jsx(ar,{className:a.list,items:o,renderEmptyState:n,children:t})})})},k=f.forwardRef((i,e)=>{const{ownProps:r,restProps:a,dataAttributes:o}=ue(cr,i),{classes:t,children:n,icon:s,href:l}=r,p=typeof n=="string"?n:void 0;return dr(l),d.jsx(sr,{ref:e,textValue:p,className:t.root,href:l,...o,...a,children:({allowsRemoving:c})=>d.jsxs(d.Fragment,{children:[s&&d.jsx("span",{className:t.icon,children:s}),n,c&&d.jsx(ft,{className:t.removeButton,slot:"remove",children:d.jsx(dt,{size:16})})]})})});S.__docgenInfo={description:`A component that renders a list of tags.

@public`,methods:[],displayName:"TagGroup",props:{items:{required:!1,tsType:{name:"ReactAriaTagListProps['items']",raw:"ReactAriaTagListProps<T>['items']"},description:""},children:{required:!1,tsType:{name:"ReactAriaTagListProps['children']",raw:"ReactAriaTagListProps<T>['children']"},description:""},renderEmptyState:{required:!1,tsType:{name:"ReactAriaTagListProps['renderEmptyState']",raw:"ReactAriaTagListProps<T>['renderEmptyState']"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};k.__docgenInfo={description:`A component that renders a tag.

@public`,methods:[],displayName:"Tag",props:{icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The icon to display in the chip."},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},description:"The size of the chip."},href:{required:!1,tsType:{name:"ReactAriaTagProps['href']",raw:"ReactAriaTagProps['href']"},description:""},children:{required:!1,tsType:{name:"ReactAriaTagProps['children']",raw:"ReactAriaTagProps['children']"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const w=ut.meta({title:"Backstage UI/TagGroup",component:S,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[i=>d.jsx(qt,{children:d.jsx(i,{})})]}),B=[{id:"banana",name:"Banana",icon:d.jsx(te,{})},{id:"apple",name:"Apple",icon:d.jsx(pt,{}),isDisabled:!0},{id:"orange",name:"Orange",icon:d.jsx(re,{}),isDisabled:!0},{id:"pear",name:"Pear",icon:d.jsx(ie,{})},{id:"grape",name:"Grape",icon:d.jsx(te,{})},{id:"pineapple",name:"Pineapple",icon:d.jsx(re,{})},{id:"strawberry",name:"Strawberry",icon:d.jsx(ie,{})}],D=w.story({args:{"aria-label":"Tag Group"},render:i=>d.jsx(S,{...i,children:B.map(e=>d.jsx(k,{children:e.name},e.id))})}),K=w.story({args:{...D.input.args},render:i=>d.jsxs(Ht,{direction:"column",children:[d.jsx(S,{...i,children:B.map(e=>d.jsx(k,{size:"small",icon:e.icon,children:e.name},e.id))}),d.jsx(S,{...i,children:B.map(e=>d.jsx(k,{size:"medium",icon:e.icon,children:e.name},e.id))})]})}),R=w.story({args:{selectionMode:"single","aria-label":"Tag Group"},render:i=>{const[e,r]=f.useState(new Set(["travel"]));return d.jsx(S,{...i,items:B,selectedKeys:e,onSelectionChange:r,children:a=>d.jsx(k,{children:a.name})})}}),M=w.story({args:{selectionMode:"multiple","aria-label":"Tag Group"},render:i=>{const[e,r]=f.useState(new Set(["travel","shopping"]));return d.jsx(S,{...i,items:B,selectedKeys:e,onSelectionChange:r,children:a=>d.jsx(k,{children:a.name})})}}),G=w.story({args:{...D.input.args},render:i=>d.jsx(S,{...i,children:B.map(e=>d.jsx(k,{icon:e.icon?e.icon:void 0,children:e.name},e.id))})}),I=w.story({render:i=>d.jsx(S,{...i,children:B.map(e=>d.jsx(k,{href:`/items/${e.id}`,children:e.name},e.id))})}),j=w.story({render:i=>d.jsx(S,{...i,children:B.map(e=>d.jsx(k,{isDisabled:e.isDisabled,children:e.name},e.id))})}),N=w.story({args:{...D.input.args},render:i=>{const[e,r]=f.useState(new Set(["travel"])),a=et({initialItems:B});return d.jsx(S,{...i,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:r,children:o=>d.jsx(k,{children:o.name})})}}),z=w.story({args:{...D.input.args},render:i=>{const[e,r]=f.useState(new Set(["travel"])),a=et({initialItems:B});return d.jsx(S,{...i,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:r,children:o=>d.jsx(k,{icon:o.icon?o.icon:void 0,children:o.name})})}});D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{code:`const Default = () => (
  <TagGroup aria-label="Tag Group">
    {initialList.map((item) => (
      <Tag key={item.id}>{item.name}</Tag>
    ))}
  </TagGroup>
);
`,...D.input.parameters?.docs?.source}}};K.input.parameters={...K.input.parameters,docs:{...K.input.parameters?.docs,source:{code:`const Sizes = () => (
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
`,...K.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{code:`const SelectionModeSingle = () => {
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
`,...j.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{code:`const RemovingTags = () => {
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
`,...N.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{code:`const WithIconAndRemoveButton = () => {
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
`,...z.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    'aria-label': 'Tag Group'
  },
  render: args => <TagGroup {...args}>
      {initialList.map(item => <Tag key={item.id}>{item.name}</Tag>)}
    </TagGroup>
})`,...D.input.parameters?.docs?.source}}};K.input.parameters={...K.input.parameters,docs:{...K.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...K.input.parameters?.docs?.source}}};R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...N.input.parameters?.docs?.source}}};z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...z.input.parameters?.docs?.source}}};const Wr=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{D as Default,j as Disabled,N as RemovingTags,M as SelectionModeMultiple,R as SelectionModeSingle,K as Sizes,G as WithIcon,z as WithIconAndRemoveButton,I as WithLink,Wr as __namedExportsOrder};
