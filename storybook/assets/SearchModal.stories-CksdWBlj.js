import{j as t,W as u,K as p,X as g}from"./iframe-rmBlqmIJ.js";import{r as h}from"./plugin-DJMXfUMd.js";import{S as l,u as c,a as x}from"./useSearchModal-C4BtJFOo.js";import{s as S,M}from"./api-CghtvCf8.js";import{S as C}from"./SearchContext-DgzeHLxO.js";import{B as m}from"./Button-z9kYs74E.js";import{m as f}from"./makeStyles-C7NHQIjx.js";import{D as j,a as y,b as B}from"./DialogTitle-CpXDu5x_.js";import{B as D}from"./Box-BJ8MGsCq.js";import{S as n}from"./Grid-S-q4EpZp.js";import{S as I}from"./SearchType-Cm45snEo.js";import{L as G}from"./List-CmgMtYJn.js";import{H as R}from"./DefaultResultListItem-BrApFqau.js";import{w as k}from"./appWrappers-BOQqf5-Z.js";import{SearchBar as v}from"./SearchBar-BuKEKrDP.js";import{S as T}from"./SearchResult-laBgfQeH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-NmRlj3M3.js";import"./Plugin-An5QFUCi.js";import"./componentData-Dhr-NMCk.js";import"./useAnalytics-C7krV7MX.js";import"./useApp-DX7Pc2xI.js";import"./useRouteRef-D2dVPoHe.js";import"./index-BlsTvS7-.js";import"./ArrowForward-CoO6q-ie.js";import"./translation-DvVdUa8i.js";import"./Page-BkjwglJP.js";import"./useMediaQuery-D4JCHD8I.js";import"./Divider-DnpHdWJy.js";import"./ArrowBackIos-Bmk6daVw.js";import"./ArrowForwardIos-BKss0CiY.js";import"./translation-BWB_LTIS.js";import"./lodash-jnxdCUG3.js";import"./useAsync-BNMgov-1.js";import"./useMountedState-ByDL7K8T.js";import"./Modal-BbaAKtj4.js";import"./Portal-Bh1pEuYq.js";import"./Backdrop-CGYhmBU5.js";import"./styled-C1fNSXy6.js";import"./ExpandMore-C66io_Nr.js";import"./AccordionDetails-DgYJ939e.js";import"./index-B9sM2jn7.js";import"./Collapse-Cw6vn11h.js";import"./ListItem-DDDa0TMv.js";import"./ListContext-Dr4uxIrN.js";import"./ListItemIcon-CwKSOf8G.js";import"./ListItemText-Dl4qJiAI.js";import"./Tabs-BB23FM0q.js";import"./KeyboardArrowRight-Dqbl3D1T.js";import"./FormLabel-BfqgZUu-.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-U0bg32J5.js";import"./InputLabel-hKFZmJZw.js";import"./Select-BAb1yxQc.js";import"./Popover-BULzLW-v.js";import"./MenuItem-if8p0vPd.js";import"./Checkbox-DOaxwPMw.js";import"./SwitchBase-hQnXccYD.js";import"./Chip-zGcxBaH9.js";import"./Link-gdOZ6zM9.js";import"./index-74f52OEU.js";import"./useObservable-D5K0wiFW.js";import"./useIsomorphicLayoutEffect-BAPUKgGj.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BeqDyeqK.js";import"./useDebounce-CYJvhEvV.js";import"./InputAdornment-BMj-bBvW.js";import"./TextField-BdSCSaNB.js";import"./useElementFilter-B7bAfWdM.js";import"./EmptyState-SROEQZbf.js";import"./Progress-DD9VZ_KN.js";import"./LinearProgress-CnBzWsJF.js";import"./ResponseErrorPanel-BTJIiMqj.js";import"./ErrorPanel-2eNM-jw_.js";import"./WarningPanel-BL_3thw1.js";import"./MarkdownContent-C07YIJuu.js";import"./CodeSnippet-fjebKIGS.js";import"./CopyTextButton-BBjaBtHx.js";import"./useCopyToClipboard-CQdeULTJ.js";import"./Tooltip-D6p3Ayxg.js";import"./Popper-B-v3u-hL.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
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
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
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
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
