import{j as t,m as d,I as u,b as h,T as g}from"./iframe-C4yti0TH.js";import{r as x}from"./plugin-BL8kxZNU.js";import{S as m,u as n,a as S}from"./useSearchModal-CAjEVCxO.js";import{B as c}from"./Button-CYNcmEzy.js";import{a as f,b as M,c as j}from"./DialogTitle-N20emC9L.js";import{B as C}from"./Box-a1543Axe.js";import{S as r}from"./Grid-v0xxfd_1.js";import{S as y}from"./SearchType-BslmEiL_.js";import{L as I}from"./List-BRXiU0XK.js";import{H as R}from"./DefaultResultListItem-DOy7zafb.js";import{s as B,M as D}from"./api-DA5O3fCt.js";import{S as T}from"./SearchContext-CczJflgI.js";import{w as k}from"./appWrappers-CHKMDW6u.js";import{SearchBar as v}from"./SearchBar-CL4RC2t3.js";import{a as b}from"./SearchResult-BQUIuLm6.js";import"./preload-helper-D9Z9MdNV.js";import"./index-BTMjwqrs.js";import"./Plugin-IDIj0Vlw.js";import"./componentData-CnWfJ3h2.js";import"./useAnalytics--K1VOgoc.js";import"./useApp-y9Jc7IOk.js";import"./useRouteRef-HPBHqWqn.js";import"./index-B-o6asHV.js";import"./ArrowForward-JohorMon.js";import"./translation-CNZz3zsN.js";import"./Page-BZhe5gWa.js";import"./useMediaQuery-Dwp2kN8M.js";import"./Divider-CU5IM_SK.js";import"./ArrowBackIos-de7UP3EB.js";import"./ArrowForwardIos-C7KOyoBJ.js";import"./translation-BHqr_tSi.js";import"./Modal-Bq63ThXv.js";import"./Portal-JPlxc26l.js";import"./Backdrop-CvNyeuNu.js";import"./styled-DNUHEHW0.js";import"./ExpandMore-C2bx2cGu.js";import"./useAsync-D8arkYRP.js";import"./useMountedState-Cru6FRlT.js";import"./AccordionDetails-DTv3HEFi.js";import"./index-DnL3XN75.js";import"./Collapse-BxjtCAeZ.js";import"./ListItem-Cb_9Twd1.js";import"./ListContext-BOYwBhLf.js";import"./ListItemIcon-BVOcAzHN.js";import"./ListItemText-BWf0pAiq.js";import"./Tabs-Diol6wdm.js";import"./KeyboardArrowRight-vFDhU7Bj.js";import"./FormLabel-BzcOsTWE.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CmTUajr5.js";import"./InputLabel-BiLRbSYU.js";import"./Select-C_CXebeo.js";import"./Popover-C0oEerqE.js";import"./MenuItem-lTxBVbJM.js";import"./Checkbox-EhXMUHs5.js";import"./SwitchBase-DJM2Sst8.js";import"./Chip-De4Lbvur.js";import"./Link-Cz9gaJJo.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-arzc73Pi.js";import"./useIsomorphicLayoutEffect-CzIfcLC5.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-KGOjz-Bx.js";import"./useDebounce-BuPZNCkH.js";import"./InputAdornment-HqMla3n8.js";import"./TextField-l0kv8J66.js";import"./useElementFilter-DMyKSC74.js";import"./EmptyState-BGfb7Jje.js";import"./Progress-hBrdaONs.js";import"./LinearProgress-B_UID65b.js";import"./ResponseErrorPanel-BFK8XMWd.js";import"./ErrorPanel-EUwm2tRb.js";import"./WarningPanel-f4sgKJ3Y.js";import"./MarkdownContent-Dh73zjai.js";import"./CodeSnippet-C8zNOjQI.js";import"./CopyTextButton-CW3FaXzD.js";import"./useCopyToClipboard-CdfTyMvr.js";import"./Tooltip-BSjhen_5.js";import"./Popper-BlfRkzWo.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
