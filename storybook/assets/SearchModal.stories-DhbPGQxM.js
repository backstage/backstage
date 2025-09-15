import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DLxOzT4t.js";import{r as x}from"./plugin-6FpJEJVS.js";import{S as m,u as n,a as S}from"./useSearchModal-DbbsLhwZ.js";import{B as c}from"./Button-DWoU60bY.js";import{a as f,b as M,c as j}from"./DialogTitle-Dn15pT6I.js";import{B as C}from"./Box-BEY2IraA.js";import{S as r}from"./Grid-DTcNMdF5.js";import{S as y}from"./SearchType-Oh_WgT9i.js";import{L as I}from"./List-D0oVWlo0.js";import{H as R}from"./DefaultResultListItem-B3GZ5cg-.js";import{s as B,M as D}from"./api-DIB8lQ_j.js";import{S as T}from"./SearchContext-CO7ZwDUu.js";import{w as k}from"./appWrappers-BgZnm0lF.js";import{SearchBar as v}from"./SearchBar-C66NqjV8.js";import{a as b}from"./SearchResult-BHpVb2LT.js";import"./preload-helper-D9Z9MdNV.js";import"./index-DAIM8wYU.js";import"./Plugin-D7Oiw_QY.js";import"./componentData-B5NpAqVg.js";import"./useAnalytics-iDMqp06i.js";import"./useApp-CkqCNNj_.js";import"./useRouteRef-HPNEm24O.js";import"./index-YuKWWjwW.js";import"./ArrowForward-BRfxW2ea.js";import"./translation-BCi-pMyb.js";import"./Page-BeSbjGB5.js";import"./useMediaQuery-NuLbEALT.js";import"./Divider-CWCd2akK.js";import"./ArrowBackIos-C9zFbTOF.js";import"./ArrowForwardIos-BP8DRFwS.js";import"./translation-D5fvAh0U.js";import"./Modal-7EqbtETg.js";import"./Portal-CdFb3as0.js";import"./Backdrop-D5lzsJdl.js";import"./styled-C22knZjm.js";import"./ExpandMore-K2fwTw0G.js";import"./useAsync-CNKDNBbw.js";import"./useMountedState-DJ6mJaNE.js";import"./AccordionDetails-DoLgEhQ2.js";import"./index-DnL3XN75.js";import"./Collapse-Dx6BQFCw.js";import"./ListItem-C0vbBd3c.js";import"./ListContext-CoRXql5V.js";import"./ListItemIcon-DKDR-JNb.js";import"./ListItemText-DNlkMNGC.js";import"./Tabs-BU8w33Dm.js";import"./KeyboardArrowRight-ChuLCjdg.js";import"./FormLabel-CIWGjYLB.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C7IDKwBs.js";import"./InputLabel-_L_-Ra5C.js";import"./Select-CPCg6RTy.js";import"./Popover-D3O0AVPe.js";import"./MenuItem-HEJX_7yi.js";import"./Checkbox-B4IBeA4V.js";import"./SwitchBase-DpNghUdM.js";import"./Chip-B5VGAhPE.js";import"./Link-CRIj9jSl.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-Bzw4Lu4i.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-ChIqkhCC.js";import"./useDebounce-DA_XtqTB.js";import"./InputAdornment-BCn3q3sW.js";import"./TextField-BTDPSMt-.js";import"./useElementFilter-C6BrAlZY.js";import"./EmptyState-B4Nku8Vi.js";import"./Progress-CNQyHm_P.js";import"./LinearProgress-BfP3PMsz.js";import"./ResponseErrorPanel-Cm7P5rPu.js";import"./ErrorPanel-RMUJvBFr.js";import"./WarningPanel-Dc2tcH1q.js";import"./MarkdownContent-C4aBi8UG.js";import"./CodeSnippet-Drl8Y1S9.js";import"./CopyTextButton-B07LVSwl.js";import"./useCopyToClipboard-C72jLjo9.js";import"./Tooltip-CfLuXrUC.js";import"./Popper-DRx4nqXa.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const ao=["Default","CustomModal"];export{i as CustomModal,s as Default,ao as __namedExportsOrder,io as default};
