import{r as g,R as x,ap as fe,am as be,j as d,p as mt}from"./iframe-C-coJuUP.js";import{A as ft,n as ae,o as bt,d as oe,g as se}from"./index-l0R7Uc5Q.js";import{c as gt,$ as $t}from"./Button-HgcBqqAF.js";import{$ as te,b as ge,a as re,f as $e,d as vt}from"./utils-U8J9_ypZ.js";import{e as yt,D as V,u as xt,f as ht,g as Tt,h as Dt,i as St,j as ve,s as kt,r as Bt}from"./SelectionManager-D4YKos0-.js";import{$ as Pt}from"./Label-DuiviT5b.js";import{c as J}from"./ListBox-HtHPVIbm.js";import{c as Lt}from"./RSPContexts-CuY07Jw8.js";import{$ as le,a as wt,c as Et}from"./SelectionIndicator-Bqf07bwT.js";import{a as Ct}from"./Text-CeDmJawZ.js";import{d as ye,b as F,e as At,g as Kt,$ as Rt}from"./useObjectRef-DoPsICjD.js";import{a as H,R as xe,C as Mt,x as W,f as Q,n as Gt,k as ce,h as ee,P as It,$ as jt}from"./useFocusable-C8ZXMjCr.js";import{b as zt,a as he,$ as Nt}from"./useFocusRing-DdAH67IB.js";import{$ as Ft,a as Ot}from"./useHighlightSelectionDescription-D3rwVHeK.js";import{$ as Wt}from"./useHasTabbableChild-DzUhc3bg.js";import{a as _t,$ as q,d as Ut}from"./Separator-BOzZKzQx.js";import{$ as Vt}from"./useField-1F73H73c.js";import{$ as Te}from"./context-eVH2RLAG.js";import{$ as qt}from"./useLocalizedStringFormatter-DwBdGSGd.js";import{a as Ht,$ as Xt}from"./useListState-G3vtAydD.js";import{c as Yt,g as Jt}from"./getNodeText-CEYPe-ow.js";import{M as Qt}from"./index-2anb1mQB.js";import{F as Zt}from"./Flex-DEyiuRhH.js";import"./preload-helper-PPVm8Dsz.js";import"./useLabel-3gXC22RO.js";import"./useLabels-DyUMAXd4.js";import"./Hidden-BZos0PUt.js";import"./useButton-DbPnANzN.js";import"./usePress-B_AIff1O.js";import"./useEvent-2i228D4Y.js";import"./useControlledState-D-0r9ToY.js";const ie=new WeakMap;function ue(i,e){var r;let{id:a}=(r=ie.get(i))!==null&&r!==void 0?r:{};if(!a)throw new Error("Unknown list");return`${a}-${er(e)}`}function er(i){return typeof i=="string"?i.replace(/\s*/g,""):""+i}function tr(i,e,r){let{isVirtualized:a,keyboardDelegate:o,layoutDelegate:t,onAction:n,disallowTypeAhead:s,linkBehavior:l="action",keyboardNavigationBehavior:u="arrow",escapeKeyBehavior:c="clearSelection",shouldSelectOnPressUp:f}=i;!i["aria-label"]&&!i["aria-labelledby"]&&console.warn("An aria-label or aria-labelledby prop is required for accessibility.");let{listProps:m}=_t({selectionManager:e.selectionManager,collection:e.collection,disabledKeys:e.disabledKeys,ref:r,keyboardDelegate:o,layoutDelegate:t,isVirtualized:a,selectOnFocus:e.selectionManager.selectionBehavior==="replace",shouldFocusWrap:i.shouldFocusWrap,linkBehavior:l,disallowTypeAhead:s,autoFocus:i.autoFocus,escapeKeyBehavior:c}),v=ye(i.id);ie.set(e,{id:v,onAction:n,linkBehavior:l,keyboardNavigationBehavior:u,shouldSelectOnPressUp:f});let $=Ft({selectionManager:e.selectionManager,hasItemActions:!!n}),A=Wt(r,{isDisabled:e.collection.size!==0}),h=H(i,{labelable:!0}),w=F(h,{role:"grid",id:v,"aria-multiselectable":e.selectionManager.selectionMode==="multiple"?"true":void 0},e.collection.size===0?{tabIndex:A?-1:0}:m,$);return a&&(w["aria-rowcount"]=e.collection.size,w["aria-colcount"]=1),Ot({},e),{gridProps:w}}const de={expand:{ltr:"ArrowRight",rtl:"ArrowLeft"},collapse:{ltr:"ArrowLeft",rtl:"ArrowRight"}};function rr(i,e,r){var a,o;let{node:t,isVirtualized:n}=i,{direction:s}=Te(),{onAction:l,linkBehavior:u,keyboardNavigationBehavior:c,shouldSelectOnPressUp:f}=ie.get(e),m=At(),v=g.useRef(null),$=()=>{r.current!==null&&(v.current!=null&&t.key!==v.current||!Mt(r.current))&&W(r.current)},A={},h=i.hasChildItems,w=e.selectionManager.isLink(t.key);if(t!=null&&"expandedKeys"in e){var O,E;let p=(O=(E=e.collection).getChildren)===null||O===void 0?void 0:O.call(E,t.key);h=h||[...p??[]].length>1,l==null&&!w&&e.selectionManager.selectionMode==="none"&&h&&(l=()=>e.toggleKey(t.key));let B=h?e.expandedKeys.has(t.key):void 0,b=1,T=t.index;if(t.level>=0&&t?.parentKey!=null){let y=e.collection.getItem(t.parentKey);if(y){let P=ir(y,e.collection);b=[...P].filter(pt=>pt.type==="item").length,T>0&&P[0].type!=="item"&&(T-=1)}}else b=[...e.collection].filter(y=>y.level===0&&y.type==="item").length;A={"aria-expanded":B,"aria-level":t.level+1,"aria-posinset":T+1,"aria-setsize":b}}let{itemProps:_,...U}=yt({selectionManager:e.selectionManager,key:t.key,ref:r,isVirtualized:n,shouldSelectOnPressUp:i.shouldSelectOnPressUp||f,onAction:l||!((a=t.props)===null||a===void 0)&&a.onAction?Kt((o=t.props)===null||o===void 0?void 0:o.onAction,l?()=>l(t.key):void 0):void 0,focus:$,linkBehavior:u}),Z=p=>{let B=ce();if(!ee(p.currentTarget,Q(p))||!r.current||!B)return;let b=le(r.current);if(b.currentNode=B,"expandedKeys"in e&&B===r.current){if(p.key===de.expand[s]&&e.selectionManager.focusedKey===t.key&&h&&!e.expandedKeys.has(t.key)){e.toggleKey(t.key),p.stopPropagation();return}else if(p.key===de.collapse[s]&&e.selectionManager.focusedKey===t.key&&h&&e.expandedKeys.has(t.key)){e.toggleKey(t.key),p.stopPropagation();return}}switch(p.key){case"ArrowLeft":if(c==="arrow"){let y=s==="rtl"?b.nextNode():b.previousNode();if(y)p.preventDefault(),p.stopPropagation(),W(y),V(y,{containingElement:q(r.current)});else if(p.preventDefault(),p.stopPropagation(),s==="rtl")W(r.current),V(r.current,{containingElement:q(r.current)});else{b.currentNode=r.current;let P=pe(b);P&&(W(P),V(P,{containingElement:q(r.current)}))}}break;case"ArrowRight":if(c==="arrow"){let y=s==="rtl"?b.previousNode():b.nextNode();if(y)p.preventDefault(),p.stopPropagation(),W(y),V(y,{containingElement:q(r.current)});else if(p.preventDefault(),p.stopPropagation(),s==="ltr")W(r.current),V(r.current,{containingElement:q(r.current)});else{b.currentNode=r.current;let P=pe(b);P&&(W(P),V(P,{containingElement:q(r.current)}))}}break;case"ArrowUp":case"ArrowDown":if(!p.altKey&&ee(r.current,Q(p))){var T;p.stopPropagation(),p.preventDefault(),(T=r.current.parentElement)===null||T===void 0||T.dispatchEvent(new KeyboardEvent(p.nativeEvent.type,p.nativeEvent))}break}},X=p=>{if(v.current=t.key,Q(p)!==r.current){Gt()||e.selectionManager.setFocusedKey(t.key);return}},lt=p=>{let B=ce();if(!(!ee(p.currentTarget,Q(p))||!r.current||!B))switch(p.key){case"Tab":if(c==="tab"){let b=le(r.current,{tabbable:!0});b.currentNode=B,(p.shiftKey?b.previousNode():b.nextNode())&&p.stopPropagation()}}},ct=xe(t.props),ut=U.hasAction?ct:{},ne=F(_,ut,{role:"row",onKeyDownCapture:Z,onKeyDown:lt,onFocus:X,"aria-label":t["aria-label"]||t.textValue||void 0,"aria-selected":e.selectionManager.canSelectItem(t.key)?e.selectionManager.isSelected(t.key):void 0,"aria-disabled":e.selectionManager.isDisabled(t.key)||void 0,"aria-labelledby":m&&(t["aria-label"]||t.textValue)?`${ue(e,t.key)} ${m}`:void 0,id:ue(e,t.key)});if(n){let{collection:p}=e,B=[...p];ne["aria-rowindex"]=B.find(b=>b.type==="section")?[...p.getKeys()].filter(b=>{var T;return((T=p.getItem(b))===null||T===void 0?void 0:T.type)!=="section"}).findIndex(b=>b===t.key)+1:t.index+1}let dt={role:"gridcell","aria-colindex":1};return{rowProps:{...F(ne,A)},gridCellProps:dt,descriptionProps:{id:m},...U}}function pe(i){let e=null,r=null;do r=i.lastChild(),r&&(e=r);while(r);return e}function ir(i,e){var r;let a=(r=e.getChildren)===null||r===void 0?void 0:r.call(e,i.key),o=a?Array.from(a):[],t=o.length>0?o[0]:null,n=[];for(;t;)n.push(t),t=t.nextKey!=null?e.getItem(t.nextKey):null;return n}const De=new WeakMap;function nr(i,e,r){let{direction:a}=Te(),o=i.keyboardDelegate||new Ut({collection:e.collection,ref:r,orientation:"horizontal",direction:a,disabledKeys:e.disabledKeys,disabledBehavior:e.selectionManager.disabledBehavior}),{labelProps:t,fieldProps:n,descriptionProps:s,errorMessageProps:l}=Vt({...i,labelElementType:"span"}),{gridProps:u}=tr({...i,...n,keyboardDelegate:o,shouldFocusWrap:!0,linkBehavior:"override",keyboardNavigationBehavior:"tab"},e,r),[c,f]=g.useState(!1),{focusWithinProps:m}=zt({onFocusWithinChange:f}),v=H(i),$=g.useRef(e.collection.size);return g.useEffect(()=>{r.current&&$.current>0&&e.collection.size===0&&c&&r.current.focus(),$.current=e.collection.size},[e.collection.size,c,r]),De.set(e,{onRemove:i.onRemove}),{gridProps:F(u,v,{role:e.collection.size?"grid":"group","aria-atomic":!1,"aria-relevant":"additions","aria-live":c?"polite":"off",...m,...n}),labelProps:t,descriptionProps:s,errorMessageProps:l}}var Se={};Se={removeButtonLabel:"إزالة",removeDescription:"اضغط على مفتاح DELETE لإزالة علامة."};var ke={};ke={removeButtonLabel:"Премахване",removeDescription:"Натиснете Delete, за да премахнете маркера."};var Be={};Be={removeButtonLabel:"Odebrat",removeDescription:"Stisknutím klávesy Delete odeberete značku."};var Pe={};Pe={removeButtonLabel:"Fjern",removeDescription:"Tryk på Slet for at fjerne tag."};var Le={};Le={removeButtonLabel:"Entfernen",removeDescription:"Auf „Löschen“ drücken, um das Tag zu entfernen."};var we={};we={removeButtonLabel:"Κατάργηση",removeDescription:"Πατήστε Διαγραφή για να καταργήσετε την ετικέτα."};var Ee={};Ee={removeDescription:"Press Delete to remove tag.",removeButtonLabel:"Remove"};var Ce={};Ce={removeButtonLabel:"Quitar",removeDescription:"Pulse Eliminar para quitar la etiqueta."};var Ae={};Ae={removeButtonLabel:"Eemalda",removeDescription:"Sildi eemaldamiseks vajutage kustutusklahvi Delete."};var Ke={};Ke={removeButtonLabel:"Poista",removeDescription:"Poista tunniste painamalla Poista-painiketta."};var Re={};Re={removeButtonLabel:"Supprimer",removeDescription:"Appuyez sur Supprimer pour supprimer l’étiquette."};var Me={};Me={removeButtonLabel:"הסר",removeDescription:"לחץ על מחק כדי להסיר תג."};var Ge={};Ge={removeButtonLabel:"Ukloni",removeDescription:"Pritisnite Delete za uklanjanje oznake."};var Ie={};Ie={removeButtonLabel:"Eltávolítás",removeDescription:"Nyomja meg a Delete billentyűt a címke eltávolításához."};var je={};je={removeButtonLabel:"Rimuovi",removeDescription:"Premi Elimina per rimuovere il tag."};var ze={};ze={removeButtonLabel:"削除",removeDescription:"タグを削除するには、Delete キーを押します。"};var Ne={};Ne={removeButtonLabel:"제거",removeDescription:"태그를 제거하려면 Delete 키를 누르십시오."};var Fe={};Fe={removeButtonLabel:"Pašalinti",removeDescription:"Norėdami pašalinti žymą, paspauskite „Delete“ klavišą."};var Oe={};Oe={removeButtonLabel:"Noņemt",removeDescription:"Nospiediet Delete [Dzēst], lai noņemtu tagu."};var We={};We={removeButtonLabel:"Fjern",removeDescription:"Trykk på Slett for å fjerne taggen."};var _e={};_e={removeButtonLabel:"Verwijderen",removeDescription:"Druk op Verwijderen om de tag te verwijderen."};var Ue={};Ue={removeButtonLabel:"Usuń",removeDescription:"Naciśnij Usuń, aby usunąć znacznik."};var Ve={};Ve={removeButtonLabel:"Remover",removeDescription:"Pressione Delete para remover a tag."};var qe={};qe={removeButtonLabel:"Eliminar",removeDescription:"Prima Delete para eliminar a tag."};var He={};He={removeButtonLabel:"Îndepărtaţi",removeDescription:"Apăsați pe Delete (Ștergere) pentru a elimina eticheta."};var Xe={};Xe={removeButtonLabel:"Удалить",removeDescription:"Нажмите DELETE, чтобы удалить тег."};var Ye={};Ye={removeButtonLabel:"Odstrániť",removeDescription:"Ak chcete odstrániť značku, stlačte kláves Delete."};var Je={};Je={removeButtonLabel:"Odstrani",removeDescription:"Pritisnite Delete, da odstranite oznako."};var Qe={};Qe={removeButtonLabel:"Ukloni",removeDescription:"Pritisnite Obriši da biste uklonili oznaku."};var Ze={};Ze={removeButtonLabel:"Ta bort",removeDescription:"Tryck på Radera för att ta bort taggen."};var et={};et={removeButtonLabel:"Kaldır",removeDescription:"Etiketi kaldırmak için Sil tuşuna basın."};var tt={};tt={removeButtonLabel:"Вилучити",removeDescription:"Натисніть Delete, щоб вилучити тег."};var rt={};rt={removeButtonLabel:"删除",removeDescription:"按下“删除”以删除标记。"};var it={};it={removeButtonLabel:"移除",removeDescription:"按 Delete 鍵以移除標記。"};var nt={};nt={"ar-AE":Se,"bg-BG":ke,"cs-CZ":Be,"da-DK":Pe,"de-DE":Le,"el-GR":we,"en-US":Ee,"es-ES":Ce,"et-EE":Ae,"fi-FI":Ke,"fr-FR":Re,"he-IL":Me,"hr-HR":Ge,"hu-HU":Ie,"it-IT":je,"ja-JP":ze,"ko-KR":Ne,"lt-LT":Fe,"lv-LV":Oe,"nb-NO":We,"nl-NL":_e,"pl-PL":Ue,"pt-BR":Ve,"pt-PT":qe,"ro-RO":He,"ru-RU":Xe,"sk-SK":Ye,"sl-SI":Je,"sr-SP":Qe,"sv-SE":Ze,"tr-TR":et,"uk-UA":tt,"zh-CN":rt,"zh-TW":it};function ar(i){return i&&i.__esModule?i.default:i}function or(i,e,r){let{item:a}=i,o=qt(ar(nt),"@react-aria/tag"),t=ye(),{onRemove:n}=De.get(e)||{},{rowProps:s,gridCellProps:l,...u}=rr({node:a},e,r),{descriptionProps:c,...f}=u,m=e.disabledKeys.has(a.key)||a.props.isDisabled,v=X=>{if(X.key==="Delete"||X.key==="Backspace"){if(m)return;X.preventDefault(),e.selectionManager.isSelected(a.key)?n?.(new Set(e.selectionManager.selectedKeys)):n?.(new Set([a.key]))}},$=It();$==="virtual"&&typeof window<"u"&&"ontouchstart"in window&&($="pointer");let A=n&&($==="keyboard"||$==="virtual")?o.format("removeDescription"):"",h=xt(A),w=a.key===e.selectionManager.focusedKey,O=e.selectionManager.focusedKey!=null,E=-1;!m&&(w||!O)&&(E=0);let _=H(a.props),U=xe(a.props),{focusableProps:Z}=jt({...a.props,isDisabled:m},r);return{removeButtonProps:{"aria-label":o.format("removeButtonLabel"),"aria-labelledby":`${t} ${s.id}`,isDisabled:m,id:t,onPress:()=>n?n(new Set([a.key])):null},rowProps:F(Z,s,_,U,{tabIndex:E,onKeyDown:n?v:void 0,"aria-describedby":h["aria-describedby"]}),gridCellProps:F(l,{"aria-errormessage":i["aria-errormessage"],"aria-label":i["aria-label"]}),...f,allowsRemoving:!!n}}function at(i){let{initialItems:e=[],initialSelectedKeys:r,getKey:a=u=>{var c;return(c=u.id)!==null&&c!==void 0?c:u.key},filter:o,initialFilterText:t=""}=i,[n,s]=g.useState({items:e,selectedKeys:r==="all"?"all":new Set(r||[]),filterText:t}),l=g.useMemo(()=>o?n.items.filter(u=>o(u,n.filterText)):n.items,[n.items,n.filterText,o]);return{...n,items:l,...sr({getKey:a},s),getItem(u){return n.items.find(c=>a(c)===u)}}}function sr(i,e){let{cursor:r,getKey:a}=i;return{setSelectedKeys(o){e(t=>({...t,selectedKeys:o}))},addKeysToSelection(o){e(t=>t.selectedKeys==="all"?t:o==="all"?{...t,selectedKeys:"all"}:{...t,selectedKeys:new Set([...t.selectedKeys,...o])})},removeKeysFromSelection(o){e(t=>{if(o==="all")return{...t,selectedKeys:new Set};let n=t.selectedKeys==="all"?new Set(t.items.map(a)):new Set(t.selectedKeys);for(let s of o)n.delete(s);return{...t,selectedKeys:n}})},setFilterText(o){e(t=>({...t,filterText:o}))},insert(o,...t){e(n=>Y(n,o,...t))},insertBefore(o,...t){e(n=>{let s=n.items.findIndex(l=>a?.(l)===o);if(s===-1)if(n.items.length===0)s=0;else return n;return Y(n,s,...t)})},insertAfter(o,...t){e(n=>{let s=n.items.findIndex(l=>a?.(l)===o);if(s===-1)if(n.items.length===0)s=0;else return n;return Y(n,s+1,...t)})},prepend(...o){e(t=>Y(t,0,...o))},append(...o){e(t=>Y(t,t.items.length,...o))},remove(...o){e(t=>{let n=new Set(o),s=t.items.filter(u=>!n.has(a(u))),l="all";if(t.selectedKeys!=="all"){l=new Set(t.selectedKeys);for(let u of o)l.delete(u)}return r==null&&s.length===0&&(l=new Set),{...t,items:s,selectedKeys:l}})},removeSelectedItems(){e(o=>{if(o.selectedKeys==="all")return{...o,items:[],selectedKeys:new Set};let t=o.selectedKeys,n=o.items.filter(s=>!t.has(a(s)));return{...o,items:n,selectedKeys:new Set}})},move(o,t){e(n=>{let s=n.items.findIndex(c=>a(c)===o);if(s===-1)return n;let l=n.items.slice(),[u]=l.splice(s,1);return l.splice(t,0,u),{...n,items:l}})},moveBefore(o,t){e(n=>{let s=n.items.findIndex(c=>a(c)===o);if(s===-1)return n;let u=(Array.isArray(t)?t:[...t]).map(c=>n.items.findIndex(f=>a(f)===c)).sort((c,f)=>c-f);return me(n,u,s)})},moveAfter(o,t){e(n=>{let s=n.items.findIndex(c=>a(c)===o);if(s===-1)return n;let u=(Array.isArray(t)?t:[...t]).map(c=>n.items.findIndex(f=>a(f)===c)).sort((c,f)=>c-f);return me(n,u,s+1)})},update(o,t){e(n=>{let s=n.items.findIndex(u=>a(u)===o);if(s===-1)return n;let l;return typeof t=="function"?l=t(n.items[s]):l=t,{...n,items:[...n.items.slice(0,s),l,...n.items.slice(s+1)]}})}}}function Y(i,e,...r){return{...i,items:[...i.items.slice(0,e),...r,...i.items.slice(e)]}}function me(i,e,r){r-=e.filter(t=>t<r).length;let a=e.map(t=>({from:t,to:r++}));for(let t=0;t<a.length;t++){let n=a[t].from;for(let s=t;s<a.length;s++)a[s].from>n&&a[s].from--}for(let t=0;t<a.length;t++){let n=a[t];for(let s=a.length-1;s>t;s--){let l=a[s];l.from<n.to?n.to++:l.from++}}let o=i.items.slice();for(let t of a){let[n]=o.splice(t.from,1);o.splice(t.to,0,n)}return{...i,items:o}}const lr=g.createContext(null),ot=g.createContext(null),cr=g.forwardRef(function(e,r){return[e,r]=te(e,r,lr),x.createElement(J.Provider,{value:null},x.createElement(Tt,{content:e.children},a=>x.createElement(ur,{props:e,forwardedRef:r,collection:a})))});function ur({props:i,forwardedRef:e,collection:r}){let a=g.useRef(null),{id:o,...t}=i;[t,a]=te(t,a,Lt);let{filter:n,shouldUseVirtualFocus:s,...l}=t,[u,c]=vt(!i["aria-label"]&&!i["aria-labelledby"]),f=Ht({...l,children:void 0,collection:r}),m=Xt(f,n),v=H(t,{global:!0}),$=Object.fromEntries(Object.entries(v).map(([_,U])=>[_,_==="id"?U:void 0])),{gridProps:A,labelProps:h,descriptionProps:w,errorMessageProps:O}=nr({...l,...$,label:c},m,a);var E;return x.createElement(re.div,{render:i.render,...v,id:o,ref:e,slot:i.slot||void 0,className:(E=i.className)!==null&&E!==void 0?E:"react-aria-TagGroup",style:i.style},x.createElement($e,{values:[[Pt,{...h,elementType:"span",ref:u}],[ot,{...A,ref:a}],[J,m],[Ct,{slots:{description:w,errorMessage:O}}]]},i.children))}const dr=g.forwardRef(function(e,r){return g.useContext(J)?x.createElement(pr,{props:e,forwardedRef:r}):x.createElement(Dt,e)});function pr({props:i,forwardedRef:e}){let r=g.useContext(J),{CollectionRoot:a}=g.useContext(ve),[o,t]=te({},e,ot),{focusProps:n,isFocused:s,isFocusVisible:l}=he(),u={isEmpty:r.collection.size===0,isFocused:s,isFocusVisible:l,state:r},c=ge({...i,children:void 0,defaultClassName:"react-aria-TagList",values:u}),f=Bt(r.selectionManager.focusedKey),m=H(i,{global:!0});return x.createElement(re.div,{...F(m,c,o,n),ref:t,"data-empty":r.collection.size===0||void 0,"data-focused":s||void 0,"data-focus-visible":l||void 0},x.createElement(Et,null,r.collection.size===0&&i.renderEmptyState?i.renderEmptyState(u):x.createElement(a,{collection:r.collection,persistedKeys:f})))}const mr=ht(St,(i,e,r)=>{let a=g.useContext(J),o=Rt(e),{focusProps:t,isFocusVisible:n}=he({within:!1}),{rowProps:s,gridCellProps:l,removeButtonProps:u,...c}=or({item:r},a,o),{hoverProps:f,isHovered:m}=Nt({isDisabled:!c.allowsSelection,onHoverStart:r.props.onHoverStart,onHoverChange:r.props.onHoverChange,onHoverEnd:r.props.onHoverEnd}),v=ge({...i,id:void 0,children:r.rendered,defaultClassName:"react-aria-Tag",values:{...c,isFocusVisible:n,isHovered:m,selectionMode:a.selectionManager.selectionMode,selectionBehavior:a.selectionManager.selectionBehavior}});g.useEffect(()=>{r.textValue},[r.textValue]);let $=H(i,{global:!0});return delete $.id,delete $.onClick,x.createElement(re.div,{ref:o,...F($,v,s,t,f),"data-selected":c.isSelected||void 0,"data-disabled":c.isDisabled||void 0,"data-hovered":m||void 0,"data-focused":c.isFocused||void 0,"data-focus-visible":n||void 0,"data-pressed":c.isPressed||void 0,"data-allows-removing":c.allowsRemoving||void 0,"data-selection-mode":a.selectionManager.selectionMode==="none"?void 0:a.selectionManager.selectionMode},x.createElement("div",{...l,style:{display:"contents"}},x.createElement($e,{values:[[gt,{slots:{remove:u}}],[ve,kt],[wt,{isSelected:c.isSelected}]]},v.children)))}),st={"bui-TagList":"_bui-TagList_1i4x5_20","bui-Tag":"_bui-Tag_1i4x5_20","bui-TagRemoveButton":"_bui-TagRemoveButton_1i4x5_72","bui-TagIcon":"_bui-TagIcon_1i4x5_83"},fr=fe()({styles:st,classNames:{root:"bui-TagGroup",list:"bui-TagList"},propDefs:{items:{},children:{},renderEmptyState:{},className:{}}}),br=fe()({styles:st,classNames:{root:"bui-Tag",icon:"bui-TagIcon",removeButton:"bui-TagRemoveButton"},analytics:!0,propDefs:{noTrack:{},icon:{},size:{dataAttribute:!0,default:"small"},href:{},children:{},className:{}}}),{RoutingProvider:gr,useRoutingRegistrationEffect:$r}=Yt(),S=i=>{const{ownProps:e,restProps:r}=be(fr,i),{classes:a,items:o,children:t,renderEmptyState:n}=e;return d.jsx(gr,{children:d.jsx(cr,{className:a.root,...r,children:d.jsx(dr,{className:a.list,items:o,renderEmptyState:n,children:t})})})},k=g.forwardRef((i,e)=>{const{ownProps:r,restProps:a,dataAttributes:o,analytics:t}=be(br,i),{classes:n,children:s,icon:l,href:u}=r,c=typeof s=="string"?s:void 0;$r(u);const f=()=>{if(u){const m=i["aria-label"]??c??Jt(s)??String(u);t.captureEvent("click",m,{attributes:{to:String(u)}})}};return d.jsx(mr,{ref:e,textValue:c,className:n.root,href:u,...o,...a,onPress:m=>{a.onPress?.(m),f()},children:({allowsRemoving:m})=>d.jsxs(d.Fragment,{children:[l&&d.jsx("span",{className:n.icon,children:l}),s,m&&d.jsx($t,{className:n.removeButton,slot:"remove",children:d.jsx(ft,{size:16})})]})})});S.__docgenInfo={description:`A component that renders a list of tags.

@public`,methods:[],displayName:"TagGroup",props:{items:{required:!1,tsType:{name:"ReactAriaTagListProps['items']",raw:"ReactAriaTagListProps<T>['items']"},description:""},children:{required:!1,tsType:{name:"ReactAriaTagListProps['children']",raw:"ReactAriaTagListProps<T>['children']"},description:""},renderEmptyState:{required:!1,tsType:{name:"ReactAriaTagListProps['renderEmptyState']",raw:"ReactAriaTagListProps<T>['renderEmptyState']"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};k.__docgenInfo={description:`A component that renders a tag.

@public`,methods:[],displayName:"Tag",props:{icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The icon to display in the chip."},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},description:"The size of the chip."},href:{required:!1,tsType:{name:"ReactAriaTagProps['href']",raw:"ReactAriaTagProps['href']"},description:""},children:{required:!1,tsType:{name:"ReactAriaTagProps['children']",raw:"ReactAriaTagProps['children']"},description:""},className:{required:!1,tsType:{name:"string"},description:""},noTrack:{required:!1,tsType:{name:"boolean"},description:""}},composes:["Omit"]};const C=mt.meta({title:"Backstage UI/TagGroup",component:S,argTypes:{selectionMode:{control:{type:"inline-radio"},options:["single","multiple"]},"aria-label":{control:{type:"text"}}},decorators:[i=>d.jsx(Qt,{children:d.jsx(i,{})})]}),L=[{id:"banana",name:"Banana",icon:d.jsx(ae,{})},{id:"apple",name:"Apple",icon:d.jsx(bt,{}),isDisabled:!0},{id:"orange",name:"Orange",icon:d.jsx(oe,{}),isDisabled:!0},{id:"pear",name:"Pear",icon:d.jsx(se,{})},{id:"grape",name:"Grape",icon:d.jsx(ae,{})},{id:"pineapple",name:"Pineapple",icon:d.jsx(oe,{})},{id:"strawberry",name:"Strawberry",icon:d.jsx(se,{})}],D=C.story({args:{"aria-label":"Tag Group"},render:i=>d.jsx(S,{...i,children:L.map(e=>d.jsx(k,{children:e.name},e.id))})}),K=C.story({args:{...D.input.args},render:i=>d.jsxs(Zt,{direction:"column",children:[d.jsx(S,{...i,children:L.map(e=>d.jsx(k,{size:"small",icon:e.icon,children:e.name},e.id))}),d.jsx(S,{...i,children:L.map(e=>d.jsx(k,{size:"medium",icon:e.icon,children:e.name},e.id))})]})}),R=C.story({args:{selectionMode:"single","aria-label":"Tag Group"},render:i=>{const[e,r]=g.useState(new Set(["travel"]));return d.jsx(S,{...i,items:L,selectedKeys:e,onSelectionChange:r,children:a=>d.jsx(k,{children:a.name})})}}),M=C.story({args:{selectionMode:"multiple","aria-label":"Tag Group"},render:i=>{const[e,r]=g.useState(new Set(["travel","shopping"]));return d.jsx(S,{...i,items:L,selectedKeys:e,onSelectionChange:r,children:a=>d.jsx(k,{children:a.name})})}}),G=C.story({args:{...D.input.args},render:i=>d.jsx(S,{...i,children:L.map(e=>d.jsx(k,{icon:e.icon?e.icon:void 0,children:e.name},e.id))})}),I=C.story({render:i=>d.jsx(S,{...i,children:L.map(e=>d.jsx(k,{href:`/items/${e.id}`,children:e.name},e.id))})}),j=C.story({render:i=>d.jsx(S,{...i,children:L.map(e=>d.jsx(k,{isDisabled:e.isDisabled,children:e.name},e.id))})}),z=C.story({args:{...D.input.args},render:i=>{const[e,r]=g.useState(new Set(["travel"])),a=at({initialItems:L});return d.jsx(S,{...i,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:r,children:o=>d.jsx(k,{children:o.name})})}}),N=C.story({args:{...D.input.args},render:i=>{const[e,r]=g.useState(new Set(["travel"])),a=at({initialItems:L});return d.jsx(S,{...i,items:a.items,onRemove:o=>a.remove(...o),selectedKeys:e,onSelectionChange:r,children:o=>d.jsx(k,{icon:o.icon?o.icon:void 0,children:o.name})})}});D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{code:`const Default = () => (
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
`,...N.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...N.input.parameters?.docs?.source}}};const Xr=["Default","Sizes","SelectionModeSingle","SelectionModeMultiple","WithIcon","WithLink","Disabled","RemovingTags","WithIconAndRemoveButton"];export{D as Default,j as Disabled,z as RemovingTags,M as SelectionModeMultiple,R as SelectionModeSingle,K as Sizes,G as WithIcon,N as WithIconAndRemoveButton,I as WithLink,Xr as __namedExportsOrder};
